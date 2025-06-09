// /src/components/ProjectList.tsx
'use client';

import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectProductContext } from '@/lib/projectProductContext';
import ProjectCard from './ProjectCard';
import AddProjectDialog from './AddProjectDialog';
import { FaPlus } from 'react-icons/fa';

interface Project {
  id: number;
  name: string;
  projectCode: string;
  startDate: string;
  endDate: string;
  supervisor: string;
  status: string;
}

export default function ProjectList() {
  const { state } = useContext(ProjectProductContext);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const sampleProjects: Project[] = [
    {
      id: 1,
      name: 'Dự án A',
      projectCode: 'DA001',
      startDate: '2025-06-01',
      endDate: '2025-12-31',
      supervisor: 'Nguyễn Văn A',
      status: 'Đang thực hiện',
    },
    {
      id: 2,
      name: 'Dự án B',
      projectCode: 'DA002',
      startDate: '2025-07-01',
      endDate: '2026-01-31',
      supervisor: 'Trần Thị B',
      status: 'Hoàn thành',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800"
        >
          <FaPlus />
        </button>
      </div>

      {state.isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {state.error && (
        <div className="text-red-500 text-center">{state.error}</div>
      )}

      {state.projects.length === 0 && !state.isLoading && !state.error && (
        <div className="text-gray-500 text-center">Không có dự án nào</div>
      )}

      <div className="grid gap-4">
        <AnimatePresence>
          {(state.projects.length > 0 ? state.projects : sampleProjects).map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isAddDialogOpen && (
        <AddProjectDialog onClose={() => setIsAddDialogOpen(false)} />
      )}
    </div>
  );
}