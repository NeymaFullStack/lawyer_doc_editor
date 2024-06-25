import React from "react";
import CollapsibleArticle from "./CollapsibleArticle";

function ArticleList({ items, showArticleTag }) {
  return (
    <ul className="ml-5 mt-2">
      {items &&
        items.length > 0 &&
        items.map((item) => (
          <li key={item.id}>
            <CollapsibleArticle showArticleTag={showArticleTag} item={item} />
          </li>
        ))}
    </ul>
  );
}

export default ArticleList;
