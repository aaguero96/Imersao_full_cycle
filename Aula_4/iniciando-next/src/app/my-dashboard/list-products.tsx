import { Product } from "@/utils/models";

const getProducts = async (): Promise<Product[]> => {
  // static side render
  // const response = await fetch('http://localhost:8000/products');

  // incremental static regeneration
  // const response = await fetch('http://localhost:8000/products', {
  //   next: {
  //     revalidate: 10,
  //   },
  // });

  // server side render
  const response = await fetch('http://localhost:8000/products', {
    cache: 'no-store',
  });
  const data = await response.json();
  return data;
}

const ListProducts = async () => {
  const products = await getProducts();

  return (
    <div>
      <h1>List Products</h1>
      <ul>
        {
          products.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default ListProducts;