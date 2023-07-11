import React from 'react';
import './style.scss';

function PostContent({ html }) {
  return (
    <div className="post-content">
      {console.log(html)}
      <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default PostContent;
