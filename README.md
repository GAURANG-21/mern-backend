<h1>Course Management Platform</h1>
  <p>This repository contains the backend code for a comprehensive Course Management Platform. The platform facilitates course uploading, deleting, and modifying, alongside user authentication, role-distinction, and payment functionalities. This project is built with Node.js, Express.js, MongoDB, Mongoose, and integrated with Razorpay for payment processing.</p>

  <h2>Key Features</h2>
  <ul>
    <li><strong>Course Management:</strong> Upload, delete, and modify courses.</li>
    <li><strong>Authentication:</strong> User registration, login, logout, profile update, and avatar update.</li>
    <li><strong>Role-Based Access Control:</strong> Differentiated access for normal users, subscribers, and admins.</li>
    <li><strong>Course Categorization:</strong> Admins can categorize and organize course content.</li>
    <li><strong>Search and Filter:</strong> Filter and search functionality for courses.</li>
    <li><strong>Subscription Management:</strong> Handle subscriptions using Razorpay.</li>
    <li><strong>Refund Management:</strong> Seamless refund functionality with proper deadlines.</li>
    <li><strong>Automated Stats:</strong> Node-cron scheduled tasks for periodic admin dashboard stats.</li>
    <li><strong>Media Management:</strong> Integrated with Cloudinary for media uploads.</li>
    <li><strong>Email Notifications:</strong> Nodemailer for sending emails related to password resets.</li>
  </ul>

<h2 style="background-color: '#f0f0f0'; padding: 10px;">Technologies Used</h2>
<ul style="background-color: #fafafa; padding: 10px;">
  <li>Node.js</li>
  <li>Express.js</li>
  <li>MongoDB</li>
  <li>Mongoose (ODM)</li>
  <li>Razorpay (for payments)</li>
  <li>Cloudinary (for media management)</li>
  <li>Nodemailer (for email notifications)</li>
  <li>Node-cron (for scheduled tasks)</li>
  <li>JWT (for authentication)</li>
  <li>bcrypt (for password hashing)</li>
  <li>cookie-parser (for handling cookies)</li>
  <li>cors (for enabling CORS)</li>
</ul>

  <h2>Installation</h2>
  <h3>Clone the repository</h3>
  <pre><code>git clone https://github.com/GAURANG-21/mern-backend.git</code></pre>
	
  <h3>Change Directory</h3>
  <pre><code>cd mern-backend</code></pre>

  <h3>Install dependencies</h3>
  <pre><code>npm install</code></pre>

  <h3>Set up environment variables</h3>
  <p>Create a <code>.env</code> file in the root directory and add the following variables:</p>
  <pre><code>PORT = PORT_NUMBER
MONGO_URI = YOUR_MONGO_DB_CONNECTION_STRING
JWT_SECRET_KEY = JWT_SECTRET KEY
FRONTEND_URL = FRONTEND_URL
SMTP_HOST = NODEMAILER_SMTP_HOST
SMTP_PORT = NODEMAILER_SMTP_PORT
SMTP_USER = NODEMAILER_SMTP_USER
SMTP_PASSWORD = NODEMAILER_SMTP_PASSWORD
CLOUDINARY_CLOUD_NAME = CLOUD_NAME_FROM_CLOUDINARY
CLOUDINARY_API_KEY = CLOUD_API_KEY_FROM_CLOUDINARY
CLOUDINARY_API_SECRET = CLOUD_API_KEY_FROM_CLOUDINARY
PLAN_ID = RAZORPAY_PLAN_ID
RAZORPAY_API_KEY = RAZORPAY_API_KEY
RAZORPAY_KEY_SECRET = RAZORPAY_KEY_SECRET
REFUND_DAYS = NUMBER_OF_DAYS_REFUND_WILL_BE_VALID
MY_EMAIL = YOUR_EMAIL</code></pre>

<h3>Change package.json scripts</h3>
	<p>Change the script to automate server restart while changes</p>
	<pre><code>"start" : "npx nodemon index.js"</code></pre>
<h3>Start the server</h3>
	<pre><code>npm start</code></pre>

  <h2>API Endpoints</h2>
  <h3>User Routes</h3>
  <ul>
    <li>POST <code>/api/v1/register</code>: Register a new user.</li>
    <li>POST <code>/api/v1/login</code>: Login a user.</li>
    <li>POST <code>/api/v1/logout</code>: Logout a user.</li>
    <li>GET <code>/api/v1/me</code>: Get your profile.</li>
    <li>PUT <code>/api/v1/updateProfile</code>: Update user profile.</li>
    <li>PUT <code>/api/v1/updateProfilePicture</code>: Update user avatar.</li>
    <li>DELETE <code>/api/v1/me</code>: Delete user profile.</li>
    <li>POST <code>/api/v1/forgetPassword</code>: Send password reset email.</li>
    <li>PUT <code>/api/v1/resetPassword/:resetTokenviaEmail</code>: Reset password.</li>
    <li>POST <code>/api/v1/addToPlaylist</code>: Add course to the playlist (Subscribers).</li>
    <li>DELETE <code>/api/v1/removeFromPlaylist</code>: Delete course from the playlist (Subscribers).</li>
  </ul>

  <h3>Course Routes</h3>
  <ul>
    <li>POST <code>/api/v1/createCourse</code>: Add a new course (Admin).</li>
    <li>DELETE <code>/api/v1/deleteCourse/:id</code>: Delete a course (Admin).</li>
    <li>GET <code>/getAllCourses</code>: Get all courses.</li>
    <li>POST <code>/api/v1/course/:id</code>: Add a new lecture to the course (Admin).</li>
    <li>DELETE <code>/api/v1/course/:id?lectureId=LECTURE_ID</code>: Delete a lecture from the course (Admin).</li>
    <li>GET <code>/api/v1/course/:id</code>: Get all Lectures (Subscribers).</li>
  </ul>

  <h3>Payment Routes</h3>
  <ul>
    <li>GET <code>/api/v1/buySubscription</code>: Create a new subscription.</li>
    <li>DELETE <code>api/v1/subscribe/cancel</code>: Cancel a subscription and refund procedure.</li>
  </ul>
  <h3>Admin Routes</h3>
  <ul>
    <li>GET <code>/api/v1/admin/getAllUsers</code>: Get all users.</li>
    <li>PUT <code>/api/v1/admin/user/:id</code>: Toggle user role.</li>
    <li>GET <code>/api/v1/admin/stats</code>: Get admin dashboard stats (Admin).</li>
  </ul>

  <h3>Other Routes</h3>
  <ul>
    <li>POST <code>/api/v1/contact</code>: Contact the admin.</li>
    <li>POST <code>/api/v1/courseRequest</code>: Request the course.</li>
  </ul>

  <h2>Contributing</h2>
  <p>Contributions are welcome! Please open an issue or submit a pull request for any changes.</p>

  <h2>Acknowledgements</h2>
  <p>Thanks to the developers of all the libraries and tools used in this project.</p>

  <h2>Contact</h2>
  <p>For any questions or feedback, please contact <a href="mailto:gaurang2621.com">gaurang2621@gmail.com</a>.</p>
