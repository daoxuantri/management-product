'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { Project } from '@/models/Project';
import { fetchProjects } from '@/api/projectApi';

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
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        isLoading: false,
        projects: state.projects.map((project) =>
          project._id === action.payload._id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        isLoading: false,
        projects: state.projects.filter((project) => project._id !== action.payload.projectId),
      };
    default:
      return state;
  }
};

export function ProjectProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadProjects = async () => {
      dispatch({ type: 'LOAD_PROJECTS' });
      try {
        const response = await fetchProjects();
        dispatch({ type: 'LOAD_PROJECTS_SUCCESS', payload: response.data });
      } catch (e) {
        dispatch({ type: 'LOAD_PROJECTS_ERROR', payload: (e as Error).message });
      }
    };
    loadProjects();
  }, []);

  return (
    <ProjectProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectProductContext.Provider>
  );
}