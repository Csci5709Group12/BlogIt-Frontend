import { useParams, Link } from 'react-router-dom';
import { Alert, Button, Card, CardBody, Container, Col, Image, Row, ListGroup, Spinner } from 'react-bootstrap';
import AppNavbar from '../Navbar/Navbar';
import BlogFeedItem from '../BlogFeed/BlogFeedItem';
import postLogo from '../../assets/post_icon.svg';
import commentLogo from '../../assets/comment_icon.svg';
import locationIcon from '../../assets/location_icon.svg';
import birthdayIcon from '../../assets/birthday_icon.svg';
import communityIcon from '../../assets/community_icon.svg';
import { useContext, useEffect, useState } from 'react';
import { getUserDataByUsername } from '../../api/User';
import { getAllBlogsByUserId } from '../../api/Blog';
import { getAllVideosByUserId } from '../../api/Video';
import { CurrentUserDataContext } from '../../App';
import VideoFeedItem from '../VideoFeed/VideoFeedItem';
import avatar from '../../img/profile_placeholder.png';

function UserProfileDisplay({ userData }) {
  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);
  const [userBlogItems, setUserBlogItems] = useState(null);
  const [userVideoItems, setUserVideoItems] = useState(null);
  const formatTimestamp = (ts) => {
    const d = new Date(ts * 1000);
    const month = d.toLocaleString('default', { month: "long" });
    return month + " " + d.getDate() + ", " + d.getFullYear()
  }

  useEffect(() => {
    const handleGetBlogsSuccess = (response) => {
      if (response.data.blogs.length > 0)
        setUserBlogItems(response.data.blogs);
    }

    const handleGetBlogsError = (error) => {
      console.log(error);
    }

    getAllBlogsByUserId(userData.id, handleGetBlogsSuccess, handleGetBlogsError);
  }, []);

  useEffect(() => {
    const handleGetVideosSuccess = (response) => {
      if (response.data.videos.length > 0)
        setUserVideoItems(response.data.videos);
    }

    const handleGetVideosError = (error) => {
      console.log(error);
    }

    getAllVideosByUserId(userData.id, handleGetVideosSuccess, handleGetVideosError);
  }, []);

  return (
    <div>
      <Card>
        <Image src={(userData && userData.profile_banner) ? userData.profile_banner : 'https://placehold.co/1200x400'} style={{ height: '200px', objectFit: 'cover' }} />
        <div style={{ height: '120px', textAlign: 'center', marginTop: '-100px', marginBottom: '1rem' }}>
          <Image className='border border-white' src={(userData && userData.profile_pic) ? userData.profile_pic : avatar} style={{ height: '128px', width: '128px', marginTop: '10px', objectFit: 'cover' }} alt="user_picture" roundedCircle />
        </div>
        <CardBody>
          <Card.Title style={{ textAlign: 'center' }}>
            {userData && userData.name}
          </Card.Title>
          <Card.Text style={{ textAlign: 'center' }}>
            {
              userData ? (
                <div className='text-secondary'>
                  {userData.bio}
                </div>
              ) : (
                <></>
              )
            }
          </Card.Text>
          <div className='d-flex justify-content-center mb-3 text-secondary'>
            {(userData && userData.location) ? (
              <div><img src={locationIcon} alt="Location Icon" /> {userData.location}</div>
            ) : (
              <></>
            )
            }
            <div className='ms-3'><img src={birthdayIcon} alt="Birthday Icon" /> Joined on {(userData && userData.join_date) ? formatTimestamp(userData.join_date) : "Jan 1, 1970"}</div>
          </div>
          {(userData && (userData.education || userData.work_status)) ? (
            <>
              <hr />
            </>
          ) : (
            <></>
          )}
          <div>
            <Row>
              {(userData && userData.education) ? (
                <Col>
                  <div className='d-flex justify-content-center'><h6>Education</h6></div>
                  <div className='d-flex justify-content-center'>{userData.education}</div>
                </Col>
              ) : (
                <></>
              )}
              {(userData && userData.work_status) ? (
                <Col>
                  <div className='d-flex justify-content-center'><h6>Work</h6></div>
                  <div className='d-flex justify-content-center'>{userData.work_status}</div>
                </Col>
              ) : (
                <></>
              )}
            </Row>
            {
              (userData && currentUserData && currentUserData._id === userData.id) ? (
                <>
                  <hr />
                </>
              ) : (
                <></>
              )
            }
          </div>
          <div className="d-flex justify-content-center">
            {
              (userData && currentUserData && currentUserData._id === userData.id) ? (
                <Link to="/settings">
                  <Button>Edit Profile</Button>
                </Link>
              ) : (
                <></>
              )
            }
          </div>
        </CardBody>
      </Card>
      <div style={{ marginTop: '4px' }}>
        <Row>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush" >
                {
                  (userBlogItems || userVideoItems) ? (
                    <ListGroup.Item><img src={postLogo} alt="Post Logo" /> {((userBlogItems) ? userBlogItems.length : 0) + ((userVideoItems) ? userVideoItems.length : 0)} posts published</ListGroup.Item>
                  ) : (
                    <></>
                  )
                }
                <ListGroup.Item><img src={commentLogo} alt="Comment Logo" /> 100 comments written</ListGroup.Item>
                <ListGroup.Item><img src={communityIcon} alt="Community Logo" /> 42 communities joined</ListGroup.Item>
              </ListGroup>
            </Card>
            <Card className='mt-3'>
              <Card.Header>
                Communities Joined
              </Card.Header>
              <ListGroup variant="flush" >
                <ListGroup.Item>Marvel</ListGroup.Item>
                <ListGroup.Item>Hiking</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardBody>
                <Card.Title>Blog Posts</Card.Title>
                {(userBlogItems) ? (
                  <ListGroup variant="flush" >
                    {userBlogItems.map((post) => (
                      <ListGroup.Item>
                        <BlogFeedItem
                          post={post}
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div>
                    No posts.
                  </div>
                )}
              </CardBody>
              <CardBody>
                <Card.Title>Video Posts</Card.Title>
                <div className='video-feed-container'>
                  <div className="row">
                    {(userVideoItems) ? (
                      <>
                        {userVideoItems.map((video) => (
                          <VideoFeedItem
                            video={video}
                          />
                        ))}
                      </>
                    ) : (
                      <div>
                        No posts.
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
              <CardBody>
                <Card.Title>Comments</Card.Title>
                <ListGroup variant="flush" >
                  <ListGroup.Item>Comment 1</ListGroup.Item>
                  <ListGroup.Item>Comment 2</ListGroup.Item>
                  <ListGroup.Item>Comment 3</ListGroup.Item>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Spinner animation='border' role='status' variant='secondary'>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    const handleGetUserSuccess = (response) => {
      setUserData(response.data);
    }

    const handleGetUserError = (error) => {
      const response = error.response;

      console.log(error);

      if (response.status === 404) {
        setUserNotFound(true);
      }
    }

    getUserDataByUsername(username, handleGetUserSuccess, handleGetUserError)
  }, [username]);

  if (userNotFound) {
    return (
      <div>
        <AppNavbar />
        <Container>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Alert variant='danger'>
              <Alert.Heading>Oh no! This page does not exist!</Alert.Heading>
              <Link to="/">
                Return to home.
              </Link>
            </Alert>
          </div>
        </Container>
      </div>
    )
  }

  if (userData === null)
    return (
      <div>
        <AppNavbar />
        <Container>
          <LoadingSpinner />
        </Container>
      </div>
    );

  return (
    <div>
      <AppNavbar />
      <Container>
        <UserProfileDisplay userData={userData} />
      </Container>
    </div>
  );
}

export default UserProfile;