pragma solidity ^0.5.0;

contract SocialThread {

  string public name;
  mapping(uint => Post) public posts;
  uint public postCount = 0;

  struct Post {
    uint id;
    string content;
    uint tipAmount;
    address payable author;
  }

  event PostCreated(
    uint id,
    string content,
    uint tipAmount,
    address payable author
  );

  constructor() public {
    name = "The Social Thread";
  }

  function createPost(string memory _content) public {
    // Raise and error and halt function if _content is blank
    require(
      bytes(_content).length > 0,
      'Post content cannot be blank!'
    );
    // Increment the post count
    postCount++;
    // Create post by passing the post postCount as PostID, content, tip as 0, and the post's author
    posts[postCount] = Post(postCount, _content, 0, msg.sender);
    // Trigger event
    emit PostCreated(postCount, _content, 0, msg.sender);
  }

}