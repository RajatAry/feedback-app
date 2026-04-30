# Feedback App

## Created by [Rajat Kumar](https://www.linkedin.com/in/rajat-kumar-87529321a) [@RajatAry](https://github.com/RajatAry)

---

## What is this?

Feedback App is a simple web application where anyone can submit their feedback with a name and message. It's built using Next.js (a modern web framework) and can be run using Docker.

Think of it like a digital suggestion box - people can write their thoughts, and you can see them all in one place.

---

## What can you do with it?

- **Submit feedback** - Anyone can write their name and a message (between 10-200 characters)
- **See all feedback** - All submitted feedback appears in a list
- **Search** - Quickly find specific feedback using the search bar
- **Sort** - View feedback from newest to oldest or vice versa
- **No duplicates** - The app prevents the same feedback from being submitted twice

---

## How to Run (Quick Start)

You need Docker installed on your computer. Open your terminal and run these two commands:

```bash
docker build -t nextjs-feedback .
docker run -p 3000:3000 nextjs-feedback
```

Once it's running, open your browser and go to: **http://localhost:3000**

That's it! You should see the feedback form ready to use.

---

## How to Use the App

### For Users (Submitting Feedback)

1. Open http://localhost:3000 in your browser
2. Type your name in the "Name" field
3. Type your feedback in the "Message" field (must be 10-200 characters)
4. Click "Submit Feedback"
5. You'll see a success message, and your feedback will appear in the list below
6. Use the search bar to find specific feedback
7. Click "Latest" or "Oldest" to change the order

### For Developers (Testing the API)

If you want to test the API directly using curl commands:

**Submit new feedback:**
```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","message":"Your feedback message here"}'
```

**Get all feedback:**
```bash
curl http://localhost:3000/api/feedback
```

---

## Technical Details

- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: In-memory (data is stored in the server's memory)
- **Container**: Docker
- **Node Version**: 22+

---

## Important Notes

- **Data Storage**: Since this uses in-memory storage, if you restart the Docker container, all feedback will be cleared. There's no database - it's kept simple for this project.
- **No Authentication**: Anyone can submit feedback. There's no login required.
- **Duplicate Prevention**: If someone tries to submit the exact same name and message twice, the app will reject it.