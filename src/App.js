import React from 'react';
import { gql } from 'apollo-boost';
import { Query ,ApolloProvider,useQuery,useLazyQuery} from "react-apollo";
import {ApolloClient, InMemoryCache}from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useParams,
  HashRouter,
  NavLink,
  useLocation,
} from "react-router-dom";

const QUERY_USERS = gql`
 {
    articles {
      id,
      time,
      title,
      intro,
      img,
      blocks{
        content
      }

    }
  
}`;
const QUERY_BLOCKS=gql`
query ($articleId:Int!){
    
      article(id:$articleId) {
       time,
       title,
       img,
        blocks{
          tag
          content
        }
  
      }
  
    }

`;
export function Block( block, status ) {
  switch (status) {
    case 'li':
      return  <li style={{marginLeft:30}}>{block.content}</li>;
    case 'h3':
      return  <h3 >{block.content}</h3>;
    case 'p':
      return  <p  class="margbot50">{block.content}</p>;
    case 'img':
      return  <div class="single_blog_post_img"><img src={block.content} alt="" /></div>;
    case 'project':
      return <h4  align="center" class="margbot50">deployed on Github Pages: <a href={""+block.content}><i class="fas fa-door-open fa-1x"></i></a></h4>;
    default:
      return <h1>Error</h1>;
  }
 
 
}
export  function Detail(){
  let { articleId } = useParams();
  const {  data ,loading,error} = useQuery(QUERY_BLOCKS, {
    variables: { articleId }
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (

   
    <div class="single_blog_post clearfix" data-animated="fadeInUp">
      <div class="single_blog_post_descr">
       
        <div class="single_blog_post_date">{(new Date(data.article.time)).toDateString()+' | '+(new Date(data.article.time)).toLocaleTimeString()}</div>
        <div class="single_blog_post_title">{data.article.title}</div>
        <ul class="single_blog_post_info">
          <li><a href="javascript:void(0);" >Admin</a></li>
          <li><a href="javascript:void(0);" >Creative</a></li>
          <li><a href="javascript:void(0);" >0 Comments</a></li>
        </ul>
      </div>

      <div class="single_blog_post_img"><img src={data.article.img} alt="" /></div>

      <div class="single_blog_post_content">
  

        {
          data.article.blocks.map(block =>(
            Block(block,block.tag)
            
          ))
        }  

    
      </div>

</div>


 
  );

}





export function UserInfo() {
  
  // Polling: rovides near-real-time synchronization with your server
  // by causing a query to execute periodically at a specified interval
 /* const query=QUERY_USERS
  const varibles={}
  const p = new Promise( (resolve) => {
    client.query({
      query,
      varibles,
      
    }).then((res) => {
      resolve(res.data)
    })
  })*/


  const { data, loading } = useQuery(QUERY_USERS);
  console.log(data)
  // should handle loading status
  if (loading) return <p>Loading...</p>;
  return  (
 <React.Fragment>
{data.articles.map(   article  => (



<div class="blog_post margbot50 clearfix" data-animated="fadeInUp">
<div id="blog1" class="blog_post_img">
  <img id="img2" src={article.img} alt="" />
  <NavLink class="zoom" to={'/detail/'+article.id}></NavLink>
</div>
<div class="blog_post_descr">
<div class="blog_post_date">{(new Date(article.time)).toDateString()+' | '+(new Date(article.time)).toLocaleTimeString()}</div>
<NavLink class="blog_post_title"  to={'/detail/'+article.id}>{article.title}</NavLink>

      <ul class="blog_post_info">
        <li><a href="javascript:void(0);" >Admin</a></li>
        <li><a href="javascript:void(0);" >Creative</a></li>
        <li><a href="javascript:void(0);" >0 Comments</a></li>
      </ul>
      <hr/>
      <div class="blog_post_content">{article.intro+" ... "}</div>
      <NavLink class="read_more_btn" to={'/detail/'+article.id}>Read More</NavLink>
</div>
</div>
))}
<ul id="sahidu" class="pagination clearfix">
            <li class="active"><a href="javascript:void(0);" >1</a></li>
            </ul>
    </React.Fragment>
  );
}
/*
const client = new ApolloClient({
    uri: 'http://54.197.2.14/graphql/',
});*/


const client = new ApolloClient({
  link: createHttpLink({
        uri: 'https://54.197.2.14:80/graphql/', 
        headers: {'Content-Type': 'application/graphql'},
        fetchOptions:{method:"GET"},
        }),
  cache:new InMemoryCache(),
})



 const App = () =>
    (<ApolloProvider client={client}>
  <HashRouter>
  <Switch>
   <Route path='/detail/:articleId' component={Detail}/>
   <Route path='/list' component={UserInfo}/>
    <Redirect to='/list'/>
   </Switch>
  </HashRouter>


</ApolloProvider>);
 
 


export default App;
