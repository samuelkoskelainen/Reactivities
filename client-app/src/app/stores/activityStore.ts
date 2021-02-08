import { action, observable, computed, makeAutoObservable, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { IActivity } from "../models/activity";
import { RootStore } from "./rootStore";



export default class ActivityStore {
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  @observable activityReqistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivityesByDate(Array.from(this.activityReqistry.values()));
  }

  groupActivityesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )
    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.toISOString().split("T")[0]
      activities[date] = activities[date] ? [...activities[date], activity] : [activity]
      return activities
    }, {} as {[key: string]: IActivity[]}));
  }
  
  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list()
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date);
          this.activityReqistry.set(activity.id, activity)
        })
        this.loadingInitial = false
      })
    } catch (error) {
      runInAction(() => {
        console.log(error)
        this.loadingInitial = false
      })
    }
  }

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          activity.date = new Date(activity.date)
          this.activity = activity;
          this.activityReqistry.set(activity.id, activity)
          this.loadingInitial = false;
        })
        return activity;
      } catch(error) {
        runInAction(() => {
          this.loadingInitial = false;
        })
        console.log(error)
      }
    }
  }

  @action clearActivity = () => {
    this.activity = null;
  }

  getActivity = (id: string) => {
    return this.activityReqistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityReqistry.set(activity.id, activity)
        this.submitting = false;
      })
      history.push(`/activities/${activity.id}`)
    } catch(error) {
      runInAction(() => {
        this.submitting = false;
        toast.error("Problem submitting data")
        console.log(error.response)
      })
    }
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {

        this.activityReqistry.set(activity.id, activity)
        this.activity = activity;
      this.submitting = false;
    })
    history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        toast.error("Problem submitting data")
        console.log(error.response)
      })
    }
  }

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id)
      runInAction(() => {
        this.activityReqistry.delete(id);
        this.submitting = false;
        this.target = "";
      })
    } catch(error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
        console.log(error)
      })
    }
  }
}

