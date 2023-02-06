import { Product } from "@/utils/models";
import { GetStaticProps } from "next";

export type IncrementalSideRegenarationProps = {
  products: Product[];
}

const IncrementalSideRegenarationPage = (props: IncrementalSideRegenarationProps) => {
  const { products } = props;

  return (
    <div>
      <h1>Incremental side regeneration</h1>
      <ul>
        <ListProducts products={products} />
      </ul>
    </div>
  )
}

const ListProducts = (props: IncrementalSideRegenarationProps) => {
  const { products } = props;
  return (
    <ul>
      {
        products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))
      }
    </ul>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const reponse = await fetch('http://localhost:8000/products');
  const data = await reponse.json();

  return {
    props: {
      products: data,
    },
    revalidate: 10, // tempo em segundos
  }
}

export default IncrementalSideRegenarationPage;