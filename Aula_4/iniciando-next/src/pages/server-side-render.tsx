import { Product } from "@/utils/models";
import { GetServerSideProps } from "next";

export type ServerSideRenderProps = {
  products: Product[];
}

const ServerSideRenderPage = (props: ServerSideRenderProps) => {
  const { products } = props;

  return (
    <div>
      <h1>Server side render</h1>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const reponse = await fetch('http://localhost:8000/products');
  const data = await reponse.json();

  return {
    props: {
      products: data,
    }
  }
}

export default ServerSideRenderPage;