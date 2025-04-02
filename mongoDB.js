// creating zen_class_programme database
use zen_class_programme     

// creating users collection
db.createCollection("users")

// inserting data into users collection
db.users.insertMany([
  {
    name: "ram",
    email: "ram@gmail.com",
    batch: "B18",
    mentor_id: ObjectId('67ed14040481ef22e1b7124a'),
    codekata_score: 150,
    attendance: [
      { date: "2020-10-16", status: "present" },
      { date: "2020-10-17", status: "absent" },
      { date: "2020-10-18", status: "absent" }
    ],
    submitted_tasks: [ObjectId('67ed11be0481ef22e1b71245'),
     ObjectId('67ed11be0481ef22e1b71246'),
     ObjectId('67ed11be0481ef22e1b71247')]
  },
  {
    name: "Yash",
    email: "Yash@gmnail.com",
    batch: "B20",
    mentor_id: ObjectId('67ed14040481ef22e1b7124b'),
    codekata_score: 200,
    attendance: [
      { date: "2020-10-18", status: "absent" },
      { date: "2020-10-19", status: "present" },
      { date: "2020-10-20", status: "present" }
    ],
    submitted_tasks: [ObjectId('67ed11be0481ef22e1b71245'),
     ObjectId('67ed11be0481ef22e1b71246'),
     ObjectId('67ed11be0481ef22e1b71247'),
     ObjectId('67ed11be0481ef22e1b71248'),
     ObjectId('67ed11be0481ef22e1b71249')]
  }
])

// creating codekata collection
db.createCollection("codekata")

//  inserting data into codekata collection
db.codekata.insertMany([
  { user_id: ObjectId('67ed0bce0481ef22e1b71236'), problems_solved: 25 },
  { user_id: ObjectId('67ed0bce0481ef22e1b71237'), problems_solved: 40 }
])

//  creating attendence collection
db.createCollection("attendance")

//  inserting data into attendance collection
db.attendance.insertMany([
  { user_id: ObjectId('67ed0bce0481ef22e1b71236'), date: "2020-10-16", status: "present" },
  { user_id: ObjectId('67ed0bce0481ef22e1b71236'), date: "2020-10-17", status: "absent" },
  { user_id: ObjectId('67ed0bce0481ef22e1b71236'), date: "2020-10-18", status: "absent" },
  { user_id: ObjectId('67ed0bce0481ef22e1b71237'), date: "2020-10-18", status: "absent" },
  { user_id: ObjectId('67ed0bce0481ef22e1b71237'), date: "2020-10-19", status: "present" },
  { user_id: ObjectId('67ed0bce0481ef22e1b71237'), date: "2020-10-20", status: "present" }
])

//  creating topics collection
db.createCollection("topics")

//  inserting data into topics collection
db.topics.insertMany([
    {  topic_name: "HTML", date: "2020-09-25" },
    {  topic_name: "CSS", date: "2020-10-02" },
    {  topic_name: "Javascript", date: "2020-10-06" },
    {  topic_name: "React.js", date: "2020-10-10" },
      {topic_name: "Node.js Basics", date: "2020-10-15" }
])

//  creating tasks collection
db.createCollection("tasks")

//  inserting data into tasks collection
db.tasks.insertMany([
    { task_name: "HTML Task", topic_id: ObjectId('67ed102f0481ef22e1b71240'), date: "2020-10-01" },
    { task_name: "CSS Task", topic_id: ObjectId('67ed102f0481ef22e1b71241'), date: "2020-10-05" },
    { task_name: "Javascript Task", topic_id: ObjectId('67ed102f0481ef22e1b71242'), date: "2020-10-09" },
    { task_name: "React.js Task", topic_id: ObjectId('67ed102f0481ef22e1b71243'), date: "2020-10-14" },
    { task_name: "Node.js Project", topic_id: ObjectId('67ed102f0481ef22e1b71244'), date: "2020-10-17" }
])


//  creating company_drives collection
db.createCollection("company_drives")

//  inserting data into company_drives collection
db.company_drives.insertMany([
  {
    company_name: "Google",
    date: ISODate("2020-10-20"),
    students_appeared: [ObjectId('67ed0bce0481ef22e1b71236'),ObjectId('67ed0bce0481ef22e1b71237')]
  },
  {
    company_name: "Microsoft",
    date: ISODate("2020-10-30"),
    students_appeared: [ObjectId('67ed0bce0481ef22e1b71237')]
  }
])

//  creating mentors collection
db.createCollection("mentors")

//  inserting data into mentors collection
db.mentors.insertMany([
  {
    mentor_name: "venkat",
    mentees: [ObjectId('67ed0bce0481ef22e1b71237')]
  },
  {
    mentor_name: "poonam",
    mentees: [ObjectId('67ed0bce0481ef22e1b71236')]
  }
])


// Queries:

// (1)Find all the topics and tasks which are thought in the month of October.
db.topics.aggregate([
  {
    $match: {
      date: { $gte: "2020-10-01", $lte: "2020-10-31" }
    }
  },
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "topic_id",
      as: "related_tasks"
    }
  }
])


// (2)Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020.
db.company_drives.find({
  date: {
    $gte: ISODate("2020-10-15"),  
    $lte: ISODate("2020-10-31")   
  }
})


// (3)Find all the company drives and students who are appeared for the placement.
db.company_drives.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "students_appeared",
      foreignField: "_id",
      as: "students_list"
    }
  }
])


// (4)Find the number of problems solved by the user in codekata.
db.codekata.aggregate([
  {
    $group: {
      _id: "$user_id",
      total_problems_solved: { $sum: "$problems_solved" }
    }
  }
])


// (5)Find all the mentors with who has the mentee's count more than 15.

// As I inserted only 1 mentee for each mentor i checked this logic with "this.mentees.length > 0"
db.mentors.find({
  $where: "this.mentees.length > 15"       
})


// (6)Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020.

// As I inserted submitted tasks as 3 and above i checked the logic with  "submitted_tasks: { $size: 3 }" so that the absentee with 3 submitted tasks will be filtered out.
db.users.aggregate([
  {
    $match: {
      attendance: {
        $elemMatch: {
          date: { $gte: "2020-10-15", $lte: "2020-10-31" },
          status: "absent"
        }
      },
      submitted_tasks: { $size: 0 }
    }
  },
  { $count: "users_absent_without_tasks" }
])







