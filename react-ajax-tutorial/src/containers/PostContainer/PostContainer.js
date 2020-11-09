import React, { Component } from "react";
import { PostWrapper, Navigator, Post } from "../../components";
import * as service from "../../services/post";

export default class PostContainer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      postId: 1,
      post: {
        title: null,
        body: null,
      },
      comments: [],
      // 요청이 응답을 기다리고 있는지 여부를 알려줌
      fetching: false,
    };
  }

  componentDidMount() {
    this.fetchPostInfo(1);
  }

  fetchPostInfo = async (postId) => {
    this.setState({
      // 요청 중
      fetching: true,
    });

    // 방법1
    // const post = await service.getPost(postId);
    // console.log(post);
    // const comments = await service.getComments(postId);
    // console.log(comments);

    // 방법2: 2개의 Promise를 기다립니다.
    const info = await Promise.all([
      service.getPost(postId),
      service.getComments(postId),
    ]);
    // console.log(info);

    const { title, body } = info[0].data;
    const comments = info[1].data;

    this.setState({
      postId,
      post: {
        title,
        body,
      },
      comments,
      // 요청 완료
      fetching: false,
    });
  };

  render() {
    // 비구조화 할당 문법을 사용하여 "this.state.post.title" 이렇게 해야되는거를 바로 "post.title" 로 할 수 있어 가독성을 향상시킨다.
    const { postId, fetching, post, comments } = this.state;
    return (
      <PostWrapper>
        <Navigator postId={postId} disabled={fetching} />
        <Post title={post.title} body={post.body} comments={comments} />
      </PostWrapper>
    );
  }
}