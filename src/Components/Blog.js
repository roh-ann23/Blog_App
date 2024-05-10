//Blogging App using Hooks
import {useEffect, useRef, useState} from 'react'
import { db } from '../firebaseInit';
import { collection, addDoc, getDocs, onSnapshot, doc, deleteDoc  } from "firebase/firestore"; 
// import { collection, getDocs } from "firebase/firestore";
// import { useReducer } from 'react';

    
// function blogReducer(state,action){
//     switch(action.type){
//         case "ADD":
//             return [action.blog, ...state];
//         case "REMOVE":
//             return state.filter((blog,index) => index !== action.index);
//         // case "Show":
//         //     return [action.renderBlog];

//         default:
//             return [];
//     }
// }


// blogReducer take two args which is state and action, in first case, case is 'add' and we'll return action.blog which we defined in dispatch fnc and in second case, case is 'remove' and where we return/performing the filter functions that we matches the index of clicked blog with actual blog
export default function Blog(){

    // Instead of passing seperate state, just combin it together and pass it as a object
    // const [title,setTitle] = useState("")
    // const [content,setContent] = useState("")

    const [formData, setFormData] = useState({title:"", content:""}) // here we are passing a object and we make changes by considering title and content as formData.title and formData.content
    const [blogs, setBlogs] = useState([])

    // Instead of using useState, we can use useReducer to manage the state
    // const [blogs,dispatch] = useReducer(blogReducer,[])   

    const titleRef = useRef(null)   // To get back focus 

    useEffect(()=>{
        titleRef.current.focus();
    },[]) // when first time we go on site, the focus will go on title by using useEffect..useEffect with second argument as empty array is alternative for componenetDidMount() in class based component 


useEffect(()=>{

    // async function fetchedData(){
    // const Snapshot = await getDocs(collection(db, "blogs"));
    // // console.log(Snapshot);
    //   const allBlogs = Snapshot.docs.map((doc)=>{
    //         return{
    //             id:doc.id,
    //             ...doc.data()
    //         }
    //     });
    //     // console.log(allBlogs);
    //     setBlogs(allBlogs)
    // }

    // fetchedData()

// Instaed of this fnc, use onSnapshot, it is listener where it'll notified to cloud then from cloud to local cache from local cache to UI...(refer Notebook(notes))

const unsubs = onSnapshot(collection(db,"blogs"), (snapshot)=>{
    const allBlogs = snapshot.docs.map((doc)=>{
                return{
                    id:doc.id,
                    ...doc.data()
                }
            });
            // console.log(allBlogs);
            setBlogs(allBlogs)

})
    
},[]);




    
    useEffect(()=>{
        if(blogs.length && blogs[0].title){
            document.title = blogs[0].title;
        }else{
            document.title = "No Blogs !!";
        }
       
        
    },[blogs,formData.title])


    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e){
        e.preventDefault();

      /*
        //Adding the blog to the blogs array   and "...blogs" we use here rest operator 

         setBlogs([{title: formData.title, content: formData.content}, ...blogs]); 
          Here instead of this, we use listener to render on UI and also on different browser..we're not manually store/render blogs
    */
        // here we take useReducer() hooks arguments 
        // dispatch({type:"ADD", blog: {title: formData.title, content: formData.content}})


        // We are using firebase connnection here, cause we have to add that data/document to the DB/FB after that submt button will click means after clickind on add data wil stored on cloud/DB 

        const docRef = (collection(db, "blogs"));
        // Add a new document with a generated id.
           await addDoc(docRef, {
                title: formData.title,
                content: formData.content,
                createdAt: new Date()
            });
            // console.log("Document written with ID: ", docRef.id);


        setFormData({title:"", content:""})   // After adding blog the input fields will empty

        // To get back focus to title input field
        titleRef.current.focus();
    

    };

    // Now we have to delete blog in real time

    // function deleteBlog(i){  // this "i" is index which we pass in that delete button below
    //     setBlogs(blogs.filter((blog,index)=> i!==index));
    //     // dispatch({type: "REMOVE", index:i})

    // }    INSTEAD OF THIS USE >>

    async function deleteBlog(id){  
        // setBlogs(blogs.filter((blog,index)=> i!==index));

        const deleteBlog = doc(db,"blogs",id)
        await deleteDoc(deleteBlog)

    }


    return(
        <>
        {/* Heading of the page */}
        <h1>Write a Blog!</h1>

        {/* Division created to provide styling of section to the form */}
        <div className="section">

        {/* Form for to write the blog */}
            <form onSubmit={handleSubmit}>

                {/* Row component to create a row for first input field */}
                <Row label="Title">
                        <input className="input" value={formData.title} onChange={(e)=>{setFormData({title:e.target.value,content:formData.content})}} ref={titleRef} 
                        // here we need to put all keys in sequential manner if we are not upddating it cause the we're using setFormdata and it has object that we are updating so whenever we need to update any key from that object, we have to take all keys and if we not use then it'll only consider the one we take or we want to update 
                            placeholder="Enter the Title of the Blog here.."/>
                </Row >

                {/* Row component to create a row for Text area field */}
                <Row label="Content">
                        <textarea className="input content" value={formData.content} onChange={(e)=>{setFormData({title:formData.title, content:e.target.value})}} required
                        placeholder="Content of the Blog goes here.."/>
                </Row >

                {/* Button to submit the blog */}            
                <button className = "btn" >ADD</button>
                

                
            </form>
                     
        </div>

        <hr/>

        {/* Section where submitted blogs will be displayed */}
        <h2> Blogs </h2>
            {blogs.map((blog,index)=>{
                return(
                    <div className='blog' key={index}>
                        <h3>{blog.title}</h3>
                        <p>{blog.content}</p>

                        {/* <div className='blog-btn'>
                            <button className="btn remove" onClick={() => deleteBlog(index)}>Delete</button>
                        </div> */}   

                        {/* INSTEAD OF THIS USE THIS  */}

                        <div className='blog-btn'>
                            <button className="btn remove" onClick={() => deleteBlog(blog.id)}>Delete</button>
                            {/* Here we are using "blog.id instead index cause we are getting real time updates to delete (check delete fnc)"  */}
                        </div>
                    </div>
                )
            })}
        
        </>
        )
    }

//Row component to introduce a new row section in the form
function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label}<br/></label>
        {props.children}
        <hr />
        </>
    )
}
