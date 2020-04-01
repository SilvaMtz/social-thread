pragma solidity ^0.5.0;

contract SocialThread {
  // State variable
  string public name;

  constructor() public {
    name = "The Social Thread";
  }

  struct Post {
    uint id;
    string content;
    uint tipAmount;
    address payable author;
  }

  mapping(uint => Post) public posts;
  uint public postCount = 0;


  function createPost(string memory _content) public {
    // Increment the post count
    postCount++;
    posts[postCount] = Post(postCount, _content, 0, msg.sender);
  }

}