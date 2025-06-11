// /src/api/projectApi.ts
import { Project } from '../models/Project';

export const fetchProjects = async (): Promise<{
  success: boolean;
  message: string;
  data: Project[];
}> => {
  try {
    const response = await fetch('http://192.168.1.27:4000/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'API error');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const fetchProjectById = async (id: string): Promise<{
  success: boolean;
  message: string;
  data: Project;
}> => {
  try {
    const response = await fetch(`http://192.168.1.27:4000/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Project not found');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const createProject = async (project: Partial<Project>): Promise<{
  success: boolean;
  message: string;
  data?: Project;
}> => {
  try {
    const response = await fetch('http://192.168.1.27:4000/projects/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Create failed');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<{
  success: boolean;
  message: string;
  data?: Project;
}> => {
  try {
    const response = await fetch(`http://192.168.1.27:4000/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to update project');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Update failed');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteProject = async (id: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`http://192.168.1.27:4000/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete project');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Delete failed');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addProductToProject = async (projectId: string, productData: { productId: string; quantity: number }): Promise<{
  success: boolean;
  message: string;
  data?: Project;
}> => {
  try {
    const response = await fetch(`http://192.168.1.27:4000/projects/${projectId}/add-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to add product to project');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Add product failed');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateProductInProject = async (projectId: string, productItemId: string, productData: { productId: string; quantity: number; total_product: number }): Promise<{
  success: boolean;
  message: string;
  data?: Project;
}> => {
  try {
    const response = await fetch(`http://192.168.1.27:4000/projects/${projectId}/update-product/${productItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product in project');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Update product failed');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteProductFromProject = async (projectId: string, productItemId: string): Promise<{
  success: boolean;
  message: string;
  data?: Project;
}> => {
  try {
    const response = await fetch(`http://192.168.1.27:4000/projects/${projectId}/delete-product/${productItemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete product from project');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Delete product failed');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};