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

  event PostTipped(
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

  function tipPost(uint _id) public payable {
    // Post existence validation
    require(
      _id > 0 && _id <= postCount,
      "Post does not exist"
    );
    // Fetch post
    Post memory _post = posts[_id];
    // Fetch the author
    address payable _author = _post.author;
    // Tip the author by sending Ether
    address(_author).transfer(msg.value);
    // Increment the tip amount
    _post.tipAmount = _post.tipAmount + msg.value;
    // Update the post
    posts[_id] = _post;
    // Trigger Tipped event
    emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
  }
}