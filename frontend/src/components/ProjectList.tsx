// /src/components/ProjectList.tsx
'use client';

import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectProductContext } from '@/lib/projectProductContext';
import ProjectCard from './ProjectCard';
import AddProjectDialog from './AddProjectDialog';
import { FaPlus } from 'react-icons/fa';
import { fetchProjects } from '@/api/projectApi';
import { Project } from '@/models/Project';

export default function ProjectList() {
  const { state, dispatch } = useContext(ProjectProductContext);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      dispatch({ type: 'LOAD_PROJECTS' });
      try {
        const response = await fetchProjects();
        dispatch({ type: 'LOAD_PROJECTS_SUCCESS', payload: response.data });
      } catch (err) {
        dispatch({ type: 'LOAD_PROJECTS_ERROR', payload: (err as Error).message });
      }
    };
    loadProjects();
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
        >
          <FaPlus /> Thêm dự án
        </button>
      </div>

      {state.isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {state.error && <div className="text-red-500 text-center">{state.error}</div>}

      {state.projects.length === 0 && !state.isLoading && !state.error && (
        <div className="text-gray-500 text-center">Không có dự án nào</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {state.projects.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isAddDialogOpen && <AddProjectDialog onClose={() => setIsAddDialogOpen(false)} />}
    </div>
  );
}