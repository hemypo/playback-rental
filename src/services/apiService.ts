
import axios from 'axios';

const API_URL = 'https://api.example.com';

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return null;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
    return true; // Return boolean instead of void
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return false; // Return boolean instead of void
  }
};
