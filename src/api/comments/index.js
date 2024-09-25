import { cache } from "react";
import Api from "../apiMethod";
import {
  getCommentListUrl,
  postCommentUrl,
  replyCommentUrl,
} from "../serviceUrl";

export const getCommentList = cache(async (documentId) => {
  try {
    const res = await Api.get(getCommentListUrl(documentId));
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
  }
});

export const postComment = cache(async (documentId, comment) => {
  try {
    const res = await Api.post(postCommentUrl, {
      document_id: documentId,
      content: comment,
    });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
  }
});

export const postReply = cache(async (comment_id, comment) => {
  try {
    const res = await Api.post(replyCommentUrl, {
      comment_id: comment_id,
      content: comment,
    });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
  }
});
