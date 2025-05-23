
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { getProductImageUrl, uploadProductImage } from '@/utils/imageUtils';

/**
 * Creates a new product
 * @param product Product data
 * @param imageFile Image file or URL
 * @returns Created product or null if creation failed
 */
export const createProduct = async (product: Partial<Product>, imageFile?: File | string): Promise<Product | null> => {
  try {
    console.log("Creating product:", product, "with image:", typeof imageFile === 'string' ? 'URL' : (imageFile ? 'File' : 'None'));
    
    let imageFileName = product.imageUrl || '';
    
    // If we have an image (file or URL), upload or use it
    if (imageFile) {
      try {
        if (typeof imageFile === 'string') {
          console.log("Using external URL for product image:", imageFile);
          imageFileName = imageFile;
        } else {
          console.log("Uploading image file before creating product");
          imageFileName = await uploadProductImage(imageFile);
        }
        console.log("Image ready, filename/URL:", imageFileName);
      } catch (uploadError) {
        console.error("Error with product image:", uploadError);
        // Continue with product creation even if image handling fails
      }
    }
    
    // Make sure we're using imageurl for the database column and all required fields are present
    const dbProduct = {
      title: product.title || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      imageurl: imageFileName, // Use the uploaded image filename or URL
      quantity: product.quantity || 1,
      available: product.available !== undefined ? product.available : true
    };
    
    // Validate that all required fields have values
    if (!dbProduct.title || !dbProduct.category) {
      throw new Error("Product title and category are required fields");
    }
    
    console.log("Inserting product with imageurl:", dbProduct.imageurl);
    
    // Insert the product
    const { data, error } = await supabase.from('products').insert([dbProduct]).select().single();
    
    if (error) {
      console.error("Error inserting product:", error);
      throw error;
    }
    
    if (!data) {
      console.error("No data returned from product insertion");
      return null;
    }
    
    console.log("Product created:", data);
    
    // Map imageurl to imageUrl for consistency in the frontend
    return {
      ...data,
      imageUrl: data.imageurl
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};
