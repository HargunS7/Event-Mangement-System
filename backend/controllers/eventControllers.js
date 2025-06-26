const { supabase } = require('../supabaseClient');


// public can view approved events

const getApprovedEvents= async(req,res)=>{
    const {data,error} = await supabase.from('events')
      .select('*')
      .eq('status','approved');
    
    if(error){
        return res.status(500).json({error:error.message});
    }
    res.json(data);
}

// admin can create events
const createEvent =async(req,res)=>{
    const{club,title,description,location,start_date,end_date,status} = req.body;
    const user = req.user;

    const{error} =await supabase.from('events').insert([{
        club,
        title,
        description,
        location,
        start_date,
        end_date,
        status,
        created_by:user.id,
    }]);

    if(error){
        return res.status(500).json({error:error.message});
    }
    res.status(201).json({message:'Event created successfully'});

}

// admins can update events
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { error } = await supabase.from('events').update(updates).eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Event updated successfully' });
};

// admins can delete events

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Event deleted successfully' });
};

module.exports = {
  getApprovedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
