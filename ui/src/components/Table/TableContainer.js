import React ,{useEffect,useState} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import "bootstrap/dist/css/bootstrap.min.css";
import "./TableContainer.css"
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

const TableContainer = () => {
  const token = JSON.parse(sessionStorage.getItem('token'));
  const [id, setId] = useState();
  const [bookName, setBookName] = useState();
  const [author, setAuthor] = useState();
  const [data, setData] = useState([]);
  let roles = sessionStorage.getItem('role').split(",");
  const role = roles.filter(role => role === 'CREATOR').length === 1 ? true : false;
  const [formErrors,setFormErrors] = useState({});

  const doFetch = async () => {
    const response = await fetch('http://localhost:5000/api/books',{
      method:'GET',
      headers:{
        'Authorization': token,
        'username':sessionStorage.getItem('username'),
         'role':sessionStorage.getItem('role')
      }
    });
    const body = await response.json();
    const books = body.results;
    setData(books);
  };

  const handleValidation = () => {
    let formIsValid = true;
    let errors = {};

    if(!bookName){
      formIsValid = false;
      errors["bookName"] = "Book Name Cannot be empty";
    }

    if(!id){
      formIsValid = false;
      errors["id"] = "Book Id Cannot be empty";
    }

    if(!author){
      formIsValid = false;
      errors["author"] = "Author Cannot be empty";
    }

  setFormErrors(errors);
  return formIsValid;
  }
  
  const deleteBooks = async(row) => {
    const response = await fetch('http://localhost:5000/api/delete-books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(row)
    })
    
    const data = await response.json();
    alert(data.message);
    doFetch();  
  }

  const editBook = async(row) => {
    const response = await fetch('http://localhost:5000/api/edit-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(row)
    })
    const data = await response.json();
    alert(data.message);
    doFetch();  
      
  }
  const filterData = async(param) =>{
    const response = await fetch('http://localhost:5000/api/books?' +param + "=1",{
      method:'GET',
      headers:{
        'Authorization': token
      }
    });
    const body = await response.json();
    const books = body.results;
   setData(books);
  }
  const filterByTime = (param) => {
    filterData(param);
  };
  
  const createBookEntry= async(e) => {
    e.preventDefault();

    if(handleValidation()){
      const createBook = {
        "name": bookName,
        "id": id,
        "createdBy": sessionStorage.getItem('username'),
        "author": author
     }
      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(createBook)
      })

      const data = await res.json();      
      alert(data.message);
      doFetch();
    }
  }
  

  

  
    useEffect(() => {
        doFetch();
    },[]);
    const deleteButton = (cell, row, rowIndex, formatExtraData) => {
      return (
        <button
          onClick={() => {
            deleteBooks(row);
          }}
        >
          Delete
        </button>
      );
    };

    const columns = [{
      dataField: 'id',
      text: 'Id',
      sort:true
    }, {
      dataField: 'name',
      text: 'Book Name',
      sort:true,
      filter: textFilter()
    }, {
      dataField: 'author',
      text: 'Author',
      sort:true,
      filter: textFilter()
    },
    {
      dataField: 'createdAt',
      text: 'Created At',
      sort:true,
      editable: false
    },
    {
      dataField: 'createdBy',
      text: 'CreatedBy(username)',
      sort:true,
      filter: textFilter(),
      editable: false
    }
  ];
  
  
  
  if(role){

    columns.push(  {
      dataField: "actions",
      text: "Delete",
      formatter: deleteButton,
      editable: false
    });
    return(
      
    <div className='table-container'>
    <div className='create-book-container'>
    <form className='create-book-form' onSubmit={e => { createBookEntry(e); } }>
    <h3 className="book-form-title">Create Book</h3>
    <span className='form-inputs'><label>ID </label>
    <input
      name='id'
      type='text'
      value={id}
      onChange={e => setId(e.target.value)} />
      <span className='error'>{formErrors.id}</span>
    </span>
    <span className='form-inputs'>
    <label>Book Name </label>
    <input
      name='name'
      type='text'
      value={bookName}
      onChange={e => setBookName(e.target.value)} />
      <span className='error'>{formErrors.bookName}</span>
    </span>
    <span className='form-inputs'>
    <label>Author </label>
    <input
      name='author'
      type='text'
      value={author}
      onChange={e => setAuthor(e.target.value)} />
      <span className='error'>{formErrors.author}</span>
    </span>
    <span className='form-inputs'>
    <input
      className='submitButton'
      type='submit'
      value='Create Book' />
    </span>
  </form>
  </div>
  <div className='table-box'>
  <button className='btn btn-primary filter-btn' onClick={()=>filterByTime('new')}>Filter By New</button>
  <button className='btn btn-primary filter-btn' onClick={()=>filterByTime('old')}>Filter By Old</button>
  <p className='error'>*Click on the cell to edit</p>
  <p className='error'>*Click on the column header to sort</p>
  <BootstrapTable keyField='_id' data={ data } columns={ columns } filter={ filterFactory()} filterPosition="top" 
  pagination={ paginationFactory() } 
  cellEdit={ cellEditFactory({
    mode: 'click',
    afterSaveCell: (oldValue, newValue, row, column) => { editBook(row);console.log(row); }
  })}/>
  </div>
  
  </div>
  )    
  }else{
    return (
      <div className='table-box'>
        
        <button onClick={()=>filterByTime('new')}>Filter By New</button>
  <button onClick={()=>filterByTime('old')}>Filter By Old</button>
  <p className='error'>*Click on the column header to sort</p>
      <BootstrapTable keyField='_id' data={ data } columns={ columns } filter={ filterFactory()} pagination={ paginationFactory() } filterPosition="top"/>
      </div>
    );
  }
  
};

export default TableContainer;