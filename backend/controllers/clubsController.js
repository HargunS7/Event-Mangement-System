// backend/controllers/clubsController.js
const { getSupabaseFromReq } = require('../utils/supabaseScoped');
const { isAdminOfClub } = require('../utils/permissions');

// GET /clubs  (public list: id, name)
async function listClubs(req, res) {
  const supabase = getSupabaseFromReq(req);
  const { data, error } = await supabase
    .from('clubs')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// GET /clubs/:clubId  (basic details + teams)
async function getClub(req, res) {
  const supabase = getSupabaseFromReq(req);
  const clubId = req.params.clubId;
  const userId =req.user.id;

  const allowed = isAdminOfClub(supabase,userId,clubId);
  if(!allowed) return res.status(403).json({message:'Forbidden'});

  const { data: club, error: e1 } = await supabase
    .from('clubs')
    .select('id, name, created_at')
    .eq('id', clubId)
    .single();

  if (e1) return res.status(404).json({ error: 'Club not found' });

  const { data: teams, error: e2 } = await supabase
    .from('teams')
    .select('id, name, is_default, created_by, created_at')
    .eq('club_id', clubId)
    .order('name');

  if (e2) return res.status(500).json({ error: e2.message });

  res.json({ ...club, teams });
}

// PATCH /clubs/:clubId  (admins of that club)
async function updateClub(req, res) {
  const supabase = getSupabaseFromReq(req);
  const clubId = req.params.clubId;
  const userId = req.user.id;

  const allowed = await isAdminOfClub(supabase, userId, clubId);
  if (!allowed) return res.status(403).json({ error: 'Forbidden' });

  const { name } = req.body;
  const { error } = await supabase
    .from('clubs')
    .update({ name })
    .eq('id', clubId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Club updated' });
}

// GET /clubs/:clubId/president
async function getClubPresident(req, res) {
  const supabase = getSupabaseFromReq(req);
  const clubId = req.params.clubId;

  const { data, error } = await supabase
    .from('club_presidents')
    .select('id, club_id, assigned_by')
    .eq('club_id', clubId)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || null);
}

// PUT /clubs/:clubId/president  (admins set president)
async function setClubPresident(req, res) {
  const supabase = getSupabaseFromReq(req);
  const clubId = req.params.clubId;
  const userId = req.user.id;

  const allowed = await isAdminOfClub(supabase, userId, clubId);
  if (!allowed) return res.status(403).json({ error: 'Forbidden' });

  const { student_id } = req.body; // profile.id of student

  // one president per club → upsert on club_id
  const { error } = await supabase
    .from('club_presidents')
    .upsert(
      { id: student_id, club_id: clubId, assigned_by: userId },
      { onConflict: 'club_id' }
    );

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'President assigned' });
}

module.exports = {
  listClubs,
  getClub,
  updateClub,
  getClubPresident,
  setClubPresident,
};
