import React, { useEffect, useState } from 'react'


function SingleChatPage({socket}) {

    const [username,setUsername]=useState()
    const [msg,setMsg]=useState('')
    const [room,setRoom]=useState()
    const [recievedMsg,setRecieveMsg]=useState([])


    const handleSubmit = (e)=>{

        e.preventDefault();

        if(!username) {
            console.warn('fill all the field required !! ')
            return
        }
        const sendData = {
            username,
            room,
            message:msg
        }
        socket.emit('single',sendData)
    }

    useEffect(()=>{
        socket.on('EndToEnd',(data)=>{
            setRecieveMsg((prevMsg)=>[...prevMsg,data])
        })

        return ()=>{
            socket.off('EndToEnd')
        }
    },[socket])

    const handleRoom =()=>{
        if(!socket || !room ) return;
        socket.emit('join_room',room)
    }
  return (
   <>
    <form onSubmit={handleSubmit}>
    <div>
    <label>Roomid</label>
    <input type='number' placeholder='room no please' onChange={(e)=>setRoom(e.target.value)} />
    <button onClick={handleRoom}>join room</button>
    </div>
    <div>
        <label>Message</label>
        <input type='text' onChange={(e)=>setMsg(e.target.value)} />

    </div>
    <div>
        <label>username</label>
        <input type='text' onChange={(e)=>setUsername(e.target.value)} />
    </div>
    
   <div>
    <button type='submit'>send Message</button>
   </div>

    </form>
    <div>
        <h3>chats - </h3>
        {recievedMsg?.map((msg)=>(<p key={msg.room}> {msg.username } :  {msg.message}</p>))}
    </div>
   </>
  )
}

export default SingleChatPage