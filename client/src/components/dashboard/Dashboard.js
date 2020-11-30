import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile, deleteAccount } from '../../actions/profile'
import Spinner from '../layouts/Spinner'
import { Link } from 'react-router-dom'
import DashBoardAction from './DashBoardAction'
import Experience from './Experience'
import Education from './Education'

const Dashboard = ({ getCurrentProfile, deleteAccount,  auth: { user }, profile: { profile, loading } }) => {
      useEffect(() => {
            getCurrentProfile()
      }, [])
      return loading && profile === null ? <Spinner /> :
            <>
                  <h1 className="large text-primary">Dashboard</h1>
                  <p className="lead">
                        <i className="fas fa-user" />Welcome {user && user.name}
                  </p>
                  {profile !== null ? <>
                  <DashBoardAction />
                  <Experience experience={profile.experience}/>
                  <Education education={profile.education} />
                  <div className="my-2">
                      <button className="btn btn-danger"
                      onClick={() => deleteAccount()}
                      >
                          <i className="fas fa-user-minus">
                          </i>
                          DELETE MY ACCOUNT
                      </button>
                  </div>
                  </> : <>
                        <p>You have not yet setup your profile , please add some info</p>
                        <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
                  </>}
            </>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile ,deleteAccount })(Dashboard)
