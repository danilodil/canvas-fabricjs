import React from "react";
import Seo from "../components/seo";
import { page } from "../data/pages/login";
import SEO from "../data/seo.json";

const Login = ({ path }) => {

  const sections = [
    { component: Login, props: { data: page.login } },
  ]

  return <div>
    <Seo seo={SEO[path] ? SEO[path] : SEO["/"]} />
    {sections.map((section, i) => (
      React.createElement(section.component, { ...section.props, key: `s-${i}` })
    ))}
  </div>
}

export default Login;
