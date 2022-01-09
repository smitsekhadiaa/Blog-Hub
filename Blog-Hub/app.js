const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog=require('./modals/blog');
const { render, redirect } = require('express/lib/response');
// express app
const app = express();


//connecting to mongoDB
const dbURI='mongodb+srv://smit:smitsekhadia99@cluster0.4f4jf.mongodb.net/Blog-Hub?retryWrites=true&w=majority'
//linking mongoose with mongoDB
mongoose.connect(dbURI)
  .then((result)=>{
    console.log('connected to mongoDB')
    app.listen(3000)})   //listining to server only if connection to mongoDB is made
  .catch((err)=>console.log(err));  //if no connection,throw error

// listen for requests


//middleware and static files
app.use(express.static('public'))  //now you can use everything in public folder in other folders like linking css sheets etc
app.use(express.urlencoded({extended:true})) //it gets all the encoded url that we need saved in an object and passes further(to make new blog)


//using third party middleware
app.use(morgan('dev'))  //on console GET /about 200 47.368ms is done by morgan middleware


//mongoose and mongodb sandbox routes
// app.get('/add-blog',(req,res)=>{
//   const blog=new Blog({
//     title:'new blog',
//     snippet:'about my new blog',
//     body:'more about my new blog'

//   });
//   blog.save()    //saves the new blog added to the database of mongoDB(asynchronyus)
//     .then((result)=>{
//       res.send(result)  //sends the id and result of the blog that is saved on the data base
//       console.log('blog saved')
//     })
//     .catch((err)=>{
//       console.log(err)
//     })

// });

// //to get all the blogs saved on the database
// app.get('/all-blogs',(req,res)=>{
//   Blog.find()             //here we dont create an instance Blog as we just need to display all the blogs present and not make a new blog
//     .then((result)=>{
//       res.send(result)
//     })
//     .catch((err)=>{
//       console.log(err)
//     })
// });

// //to get a blog by its id
// app.get('/single-blog',(req,res)=>{
//   Blog.findById('61dabf8220a36a5455191f09')
//     .then((result)=>{
//       res.send(result)
//     })
//     .catch((err)=>{
//       console.log(err);
//     });
// });




// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');

// app.get('/',(req,res)=>{
//   console.log("req recived");
// })


//writing middleware

app.use((req,res,next)=>{  
  console.log('new request made')
  console.log('hostname:',req.hostname)
  console.log('path:',req.path)
  console.log('method:',req.method)    //after this req is made the website will just keep loading and not update.to solve this we use next()
  next();  //next is used to tell browser that after we have fired this function, move on further to the next code
}) 

app.use((req,res,next)=>{  
  console.log('in the next middleware')
  next();  
}) 


app.get('/', (req, res) => {
  // const blogs = [
  //   {title: 'football', snippet: 'Football is a family of team sports that involve, to varying degrees, kicking a ball to score a goal. Unqualified, the word football normally means the form of football that is the most popular where the word is used. Sports commonly called football include association football (known as soccer in North America and Oceania); gridiron football (specifically American football or Canadian football); Australian rules football; rugby union and rugby league; and Gaelic football.[1] These various forms of football share to varying extent common origins and are known as football codes.'},

  //   {title: 'stars', snippet: 'A star is any massive self-luminous celestial body of gas that shines by radiation derived from its internal energy sources. Of the tens of billions of trillions of stars in the observable universe, only a very small percentage are visible to the naked eye.'},

  //   {title: 'cricket', snippet: 'Cricket is a bat-and-ball game played between two teams of eleven players each on a field at the centre of which is a 22-yard (20-metre) pitch with a wicke'},
  // ];
  // res.render('index', { title: 'Home', blogs });
  res.redirect('/blogs')
});

app.get('/blogs',(req,res)=>{
  Blog.find().sort({createdAt: -1})
    .then((result)=>{
      res.render('index',{title:'All Blogs', blogs:result})
    })
    .catch((err)=>{
      console.log(err);
    })
})

app.post('/blogs',(req,res)=>{
  // console.log(req.body);   //req.body contains title snippet and body of the new blog added
  //creating new instance of blog to save the new added blog
  const blog= new Blog(req.body)  //here req.body is passed as it contains all the required data for the new blog

  blog.save()
    .then((result)=>{
      res.redirect('/blogs');
    })
    .catch((err)=>{
      console.log(err);
    })

})

app.get('/blogs/:id',(req,res)=>{
  const id= req.params.id;    //we access the routes parameter id by req.params.parameterName
  Blog.findById(id)
    .then((result)=>{
      res.render('details' , { blog:result, title:'Blog Details'})  //when it finds the id from data base it fires this function and renders details.ejs
    })
    .catch((err)=>{
      res.render('404', {title:'Blog Not Fond'})
    })
})

app.delete('/blogs/:id',(req,res)=>{
  const id= req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result)=>{
      res.json({redirect:'/blogs'})
    })
    .catch((err)=>{
      console.log(err)
    })
})

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});



app.get('/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});