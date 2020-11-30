const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
const { check, validationResult } = require('express-validator')
const config = require('config')
const request = require('request')

// to get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

    if (!profile) {
      res.status(400).json({ msg: 'Profile not found' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Server error' })
  }
})

// to create or update profile
router.post('/', [auth,
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { company, website, location, status, skills, bio, githubusername, youtube, facebook, twitter, instagram, linkedin } = req.body

  // buid profile

  const profileFields = {}

  profileFields.user = req.user.id
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }

  // build social object
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (instagram) profileFields.social.instagram = instagram
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin

  try {

    let profile = await Profile.findOne({ user: req.user.id })
    if (profile) {
      // update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
      return res.status(200).json(profile)
    }
    // create profile

    profile = new Profile(profileFields)

    await profile.save()

    res.status(200).json(profile)

  } catch (err) {
    console.error(err)
    res.status(500).send('server error')
  }
})

// get all profile

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.status(200).json(profiles)
  } catch (err) {
    console.error(err)
    res.status(500).json('server error')
  }
})

// get profile by id

router.get('/user/:user_id', async (req, res) => {
  try {
    const profiles = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
    if (!profiles) {
      return res.status(400).json({ msg: 'user not found' })
    }
    res.status(200).json(profiles)
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'user not found' })
    }
    res.status(500).json('server error')
  }
})

// delete all profile, post and user
// get all profile

router.delete('/', auth, async (req, res) => {
  try {
    // remove user post
    await Post.deleteMany({user:req.user.id})
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    // remove user
    await User.findOneAndRemove({ _id: req.user.id })
    res.status(200).json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json('server error')
  }
})

// add experience
router.put('/experience', [auth,
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From is required').not().isEmpty()
], async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, company, location, from, to, current, description } = req.body

  const newExp = {
    title, company, location, from, to, current, description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id })
    profile.experience.unshift(newExp)
    await profile.save()
    res.status(200).json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).send('sever error')
  }
})

// delete experience

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    //  get and remove 
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    profile.save()

    res.status(200).json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).send('sever error')
  }
})

// add eduction
router.put('/education', [auth,
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree Company is required').not().isEmpty(),
  check('fieldofstudy', 'Fieldofstudy is required').not().isEmpty(),
  check('from', 'From is required').not().isEmpty()
], async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { school, degree, fieldofstudy, from, to, current, description } = req.body

  const newEdu = {
    school, degree, fieldofstudy, from, to, current, description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id })
    profile.education.unshift(newEdu)
    await profile.save()
    res.status(200).json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).send('sever error')
  }
})

// delete education

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    //  get and remove 
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.education.splice(removeIndex, 1)

    profile.save()

    res.status(200).json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).send('sever error')
  }
})

// @route GET api/profile/github/:username
// @desc get github profile for user
// @auth PRIVATE

router.get('/github/:username', (req, res) => {
  try {

    const option = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&
      client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(option, (error, response, body) => {
      if (error) {
        console.log(error)
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({ 'msg': 'No github user found' })
      }
      res.json(JSON.parse(body))
    })

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})


module.exports = router