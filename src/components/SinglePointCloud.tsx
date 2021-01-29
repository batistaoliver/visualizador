import React, { PureComponent, useState } from 'react' 
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import CloudView from 'pages/cloud-view/index';
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'

type Props = {
   id:number
 }
 

export default class BasicTable extends PureComponent <Props,{}, { url: string }>{
   state= {url: ""}
   
componentDidMount(){
   axios({ 
      method: 'get',
      url: 'http://localhost:8880/api/point-clouds/' + this.props.id
    })
      .then((response)=>{
        this.setState(response)
        console.log(response.data.url)
        this.setState({url: response.data.url})
        
      })
      .catch((response) =>{
       console.log(response)
      })
    }
 
 render() {
    if(!this.state.url){
       return null
    }
    return (
       <div>
             <div>
                <CloudView url={"http://localhost:8880" + this.state.url}/>
             </div> 
       </div>
    )
 }
}