import { stripSummaryForJitFileSuffix } from "@angular/compiler/src/aot/util";
import { Component, OnInit } from "@angular/core";

interface Story {
    by: string,
    descendants: number,
    id: number,
    kids: number[],
    score: number,
    time: number,
    title: string,
    type: string,
    url: string
}

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss']
})

export class StoryComponent implements OnInit{
    loading: boolean = false;
    stories: Story[] = [];
    constructor() {}

    ngOnInit() {
        // this.fetchAllStories();
        this.testFunction();
    }

    async testFunction() {
        this.loading = true;
        let response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
        let data = await response.json();
        let storyData = [];
        for (let story of data) {
            if (storyData.length < 30) {
                storyData.push(story)
            } else {
                continue;
            }
        }
        let storyPromises: Promise<any>[] = [];
        for (let numericStory of storyData) {
            let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${numericStory}.json?print=pretty`)
            let data = await response.json();
            storyPromises.push(data)
        }
        let fulfilled: Story[] = await Promise.all(storyPromises)
        console.log(fulfilled)
        fulfilled.forEach((story: Story) => {
            let equation = Math.floor((((Math.round(Date.now() / 1000) - story.time) / 60) / 60))
            if (equation < 1) {
                story.time = (Math.round(Date.now() / 1000) - story.time) / 60
                story.type = 'minutes'
            } else if (equation <= 24) {
                story.time = equation;
                story.type = equation === 1 ? 'hour' : 'hours'
            } else {
                let days = equation / 24;
                story.time = Math.floor(days)
                story.type = days === 1 ? 'day' : 'days'
            }
            if (story.url) {
                story.url = `(${story.url.split('/')[2]})`;
            } else {
                return null;
            }
        })
        console.log(fulfilled)
        this.loading = false;
        this.stories = fulfilled;
    }
}