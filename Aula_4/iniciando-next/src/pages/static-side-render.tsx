import { Product } from "@/utils/models";
import { GetStaticProps } from "next";

export type StaticSideRenderProps = {
  products: Product[];
}

const StaticSideRenderPage = (props: StaticSideRenderProps) => {
  const { products } = props;

  return (
    <div>
      <h1>Static side render</h1>
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

export const getStaticProps: GetStaticProps = async () => {
  const reponse = await fetch('http://localhost:8000/products');
  const data = await reponse.json();

  return {
    props: {
      products: data,
    }
  }
}

export default StaticSideRenderPage;