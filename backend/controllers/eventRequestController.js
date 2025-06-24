const {supabase} = require('../supabaseClient');

// posting event requests

const createEventRequests = async(req,res)=>{
    const{club,title,description,location,start_date,end_date} = req.body;
    const user = req.user; 

    const{error} = await supabase.from('event_requests').insert([{
        club,
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

// get my event requests

const getMyEventRequests = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('event_requests')
    .select('*')
    .eq('requested_by', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};


//put event requests by id(updating)

const updateEventRequests = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const user = req.user;

  // First, fetch the existing request
  const { data: existingRequest, error: fetchError } = await supabase
    .from('event_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !existingRequest) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const isAdmin = user.role === 'admin';
  const isOwner = existingRequest.requested_by === user.id;
  const isPending = existingRequest.status === 'pending';

  if (!(isAdmin || (isOwner && isPending))) {
    return res.status(403).json({ error: 'Forbidden: You cannot update this request' });
  }

  const { error: updateError } = await supabase
    .from('event_requests')
    .update(updates)
    .eq('id', id);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  res.json({ message: 'Request updated' });
};

//deleting event-requests by id

const deleteEventRequests = async(req,res)=>{
    const{id} =req.params;
    const{error} = await supabase.from('event_requests').delete().eq('id',id);
    console.log('🗑️ Deleting request with ID:', id);

    if(error){
        return res.status(500).json({error:error.message});
    }
    res.json({message:'Request deleted'});
};


module.exports = {createEventRequests,getAllEventRequests,getEventRequestsById,getMyEventRequests,updateEventRequests,deleteEventRequests};