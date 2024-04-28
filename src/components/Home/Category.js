import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { RevealWrapper } from "next-reveal";
import { getCategories } from "@/services";

const HomeCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // const fetchCategories = async () => {
    //   try {
    //     const categorySnapshot = await getDocs(collection(db, "categories"));
    //     const categoryData = categorySnapshot.docs.map((doc) => doc.data());
    //     setCategories(categoryData);
    //   } catch (error) {
    //     console.error("Error fetching categories:", error);
    //   }
    // };

    fetchCategories();
  }, []);

  const fetchCategories = () => {
    getCategories()
      .then((res) => {
        setCategories(res?.data?.categories);
      })
      .catch((err) => {
        console.log("err.", err?.response?.data);
      });
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 ">
      {categories.map((category, index) => {
        return (
          <RevealWrapper
            rotate={{ x: 0, y: 0, z: 0 }}
            origin="bottom"
            delay={200}
            duration={800}
            distance="200px"
            reset={true}
            viewOffset={{ top: 0, right: 0, bottom: 0, left: 0 }}
            key={index}
          >
            <CategoryCard
              title={category.name}
              description={category.description}
              path={category.url}
              images={category.images.url}
            />
          </RevealWrapper>
        );
      })}
    </div>
  );
};
export default HomeCategory;
