const { createClient } = require("@supabase/supabase-js");
const {supabase} = require('../supabaseClient');
const jwt = require("jsonwebtoken");

// posting event requests

const createEventRequests = async(req,res)=>{
    const{club_id,title,description,location,start_date,end_date} = req.body;
    const user = req.user; 

    const{error} = await supabase.from('event_requests').insert([{
        club_id,
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

//----------------------------------------------------------------------------------------


// const getAllEventRequests = async(req,res)=>{
//     const{data,error} = await supabase.from('event_requests').select('*');
//     if(error){
//         return res.status(500).json({error:error.message});
//     }
//     res.json(data);
// };


//----------------------------------------------------------------------------------------


// trying this new code 
// Ensure you have a Supabase client instance created with your service_role key.
// This is more secure for backend operations.

// const getAllEventRequests = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json({ error: "Missing auth token" });
//     }
//     console.log("Decoded user:", jwt.decode(token));

//     // Create Supabase client with the token attached → RLS applies
//      const supabaseClient = createClient(
//       process.env.SUPABASE_URL,
//       process.env.SUPABASE_ANON_KEY,
//       {
//         global: {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             apikey: process.env.SUPABASE_ANON_KEY,
//           },
//         },
//         auth: { persistSession: false, detectSessionInUrl: false },
//       }
//     );


//     const { data: who } = await supabaseClient.rpc('whoami');
//     console.log('whoami ->', who);

//     // Fetch with RLS enforced
//     const { data, error } = await supabaseClient
//       .from("event_requests")
//       .select("*");

//     if (error) {
//       console.error("Fetch error:", error);
//       return res.status(500).json({ error: error.message });
//     }

//     res.json(data);
//   } catch (err) {
//     console.error("Unhandled error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



//-------------------------------------------------------------------------------
//this code works ---

const getAllEventRequests = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const decoded = jwt.decode(token);
    console.log("Decoded user:", decoded);

    // Fetch admin's club_id
    const { data: adminRows, error: adminError } = await supabase
      .from("admins")
      .select("club_id")
      .eq("id", decoded.sub);

    if (adminError) return res.status(500).json({ error: adminError.message });
    if (!adminRows.length) return res.json([]);

    const clubId = adminRows[0].club_id;

    // Fetch only requests for that club
    const { data, error } = await supabase
      .from("event_requests")
      .select("*")
      .eq("club_id", clubId);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//------------------------------------------------------------------------------------------

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
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data, error } = await supabaseClient
      .from("event_requests")
      .select("*");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//put event requests by id(updating)

// const updateEventRequests = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;
//   const user = req.user;

//   // First, fetch the existing request
//   const { data: existingRequest, error: fetchError } = await supabase
//     .from('event_requests')
//     .select('*')
//     .eq('id', id)
//     .single();

//   if (fetchError || !existingRequest) {
//     return res.status(404).json({ error: 'Request not found' });
//   }

//   const isAdmin = user.role === 'admin';
//   const isOwner = existingRequest.requested_by === user.id;
//   const isPending = existingRequest.status === 'pending';

//   if (!(isAdmin || (isOwner && isPending))) {
//     return res.status(403).json({ error: 'Forbidden: You cannot update this request' });
//   }

//   const { error: updateError } = await supabase
//     .from('event_requests')
//     .update(updates)
//     .eq('id', id);

//   if (updateError) {
//     return res.status(500).json({ error: updateError.message });
//   }

//   res.json({ message: 'Request updated' });
// };
const updateEventRequests = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const user = req.user;

  // Fetch the existing request
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

  // Only admin or owner (if still pending) can update
  if (!(isAdmin || (isOwner && isPending))) {
    return res.status(403).json({ error: 'Forbidden: You cannot update this request' });
  }

  // Apply update to event_requests
  const { error: updateError } = await supabase
    .from('event_requests')
    .update(updates)
    .eq('id', id);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  // 🟢 If admin approved the request, insert into `events` table
  if (isAdmin && updates.status === 'approved') {
    const {club_id, title, description, location, start_date, end_date } = existingRequest;

    const { error: insertError } = await supabase
      .from('events')
      .insert([{
        club_id,
        title,
        description,
        location,
        start_date,
        end_date,
        status: 'approved',
        created_by: existingRequest.requested_by,
      }]);

    if (insertError) {
      return res.status(500).json({ error: 'Request updated but event creation failed: ' + insertError.message });
    }
  }

  res.json({ message: 'Request updated successfully' });
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