const {supabase} = require('../supabaseClient');

// posting event requests

const createEventRequests = async(req,res)=>{
    const{title,description,location,start_date,end_date} = req.body;
    const user = req.user; 

    const{error} = await supabase.from('event_requests').insert([{
        title,
        description,
        location,
        start_date,
        end_date,
        requested_by:user.id,
    }]);

    if(error){
        return res.status(500).json({error:error.message});
    }

    res.status(201).json({message:'Event request created successfuly'});

};

// get /event-requests/:id
const getAllEventRequests = async(req,res)=>{
    const{data,error} = await supabase.from('event_requests').select('*');
    if(error){
        return res.status(500).json({error:error.message});
    }
    res.json(data);
};

const getEventRequestsById = async(req,res)=>{
    const{id} = req.params;
    const{data,error} = await supabase.from('event_requests')
        .select('*')
        .eq('id',id)
        .single();
    
    if(error){
        return res.status(404).json({error:'Not Found'});
    }
    res.json(data);
};

//put event requests by id(updating)

const updateEventRequests = async(req,res)=>{
    const{id} = req.params;
    const updates =req.body;

    const{error} = await supabase.from('event_requests')
        .update(updates)
        .eq('id',id);
    if(error){
        return res.status(500).json({error:error.message});
    }

    res.json({message:'Request updated'});
};

//deleting event-requests by id

const deleteEventRequests = async(req,res)=>{
    const{id} =req.params;
    const{error} = await supabase.from('event_requests').delete().eq('id',id);

    if(error){
        return res.status(500).json({error:error.message});
    }
    res.json({message:'Request deleted'});
};


module.exports = {createEventRequests,getAllEventRequests,getEventRequestsById,updateEventRequests,deleteEventRequests};