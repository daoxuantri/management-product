// /src/lib/projectProductContext.tsx
'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';

interface Project {
  id: number;
  name: string;
  projectCode: string;
  startDate: string;
  endDate: string;
  supervisor: string;
  status: string;
}

interface State {
  isLoading: boolean;
  error: string | null;
  projects: Project[];
}

interface Action {
  type: string;
  payload?: any;
}

interface ProjectProductContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const ProjectProductContext = createContext<ProjectProductContextType>({
  state: { isLoading: false, error: null, projects: [] },
  dispatch: () => null,
});

const initialState: State = {
  isLoading: false,
  error: null,
  projects: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_PROJECTS':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_PROJECTS_SUCCESS':
      return { ...state, isLoading: false, projects: action.payload };
    case 'LOAD_PROJECTS_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_PROJECT':
      return {
        ...state,
        isLoading: false,
        projects: [...state.projects, { id: state.projects.length + 1, ...action.payload }],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        isLoading: false,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        isLoading: false,
        projects: state.projects.filter((project) => project.id !== action.payload.projectId),
      };
    default:
      return state;
  }
};

export function ProjectProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Giả lập API call để tải danh sách dự án
    dispatch({ type: 'LOAD_PROJECTS' });
    try {
      // Thay bằng API call thực tế khi có
      setTimeout(() => {
        dispatch({ type: 'LOAD_PROJECTS_SUCCESS', payload: [] });
      }, 1000);
    } catch (e) {
      dispatch({ type: 'LOAD_PROJECTS_ERROR', payload: 'Lỗi khi tải danh sách dự án' });
    }
  }, []);

  return (
    <ProjectProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectProductContext.Provider>
  );
}