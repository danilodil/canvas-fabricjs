import React from "react";
import Seo from "../components/seo";
import Editor from "../sections/Editor";
import { page } from "../data/pages/home";
import SEO from "../data/seo.json";

const Home = ({ path }) => {

  const sections = [
    { component: Editor, props: { data: page.editor } },
  ]

  return <div>
    <Seo seo={SEO[path] ? SEO[path] : SEO["/"]} />
    {sections.map((section, i) => (
      React.createElement(section.component, { ...section.props, key: `s-${i}`})
    ))}
  </div>
}

export default Home;
