import {XMLParser} from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string){

    try{
        const response = await fetch(feedURL, {
            method: "GET",
            mode: "cors",
            headers: {
                "User-Agent": "gator",
            },
        });
        

        //Parse and build the response into xml
        const responseText = await response.text();
        const JSONobj = processXMLtoJSON(responseText).rss;
        console.log(JSONobj);

        if (!(JSONobj.channel)){
            throw new Error("Something is wrong: No channel found on parsed JSON object after fetch!");
        };

        //Extracting Metadata
        let title = "";
        let link = "";
        let description = "";
        let itemList: string[][] = [[]];
        const channel = JSONobj.channel;

        if(channel.title){
            title = channel.title;
        };
        if(channel.link){
            link = JSONobj.channel.link;
        };
        if(channel.description){
            description = JSONobj.channel.description;
        };

        //Extract info on each RSSItem
        if(channel.item != undefined){
            if(!Array.isArray(channel.item)){
                channel.item = [];
            }else{
                itemList = extractItemInfo(channel.item);
            };
        };

        return {
            title: title,
            link: link,
            description: description,
            items: itemList,
        };

    }catch(err){
        console.log(`Failed fetching Feed! ${err}`);
    };

};

function processXMLtoJSON(responseContent: string) { //Builds XML obj from response string
    try{
    const parser = new XMLParser();
    const parsedObj = parser.parse(responseContent);
        
    return parsedObj;

    }catch(err){
        throw new Error(`Failed processing XML! ${err}`);
    };
};

function extractItemInfo(itemArray: RSSItem[]){
    const itemList = [];
    for(let eachItem of itemArray){
        if(eachItem.title && eachItem.link && eachItem.description && eachItem.pubDate){
            let itemInfo: string[] = [];
            itemInfo.push(eachItem.title);
            itemInfo.push(eachItem.link);
            itemInfo.push(eachItem.description);
            itemInfo.push(eachItem.pubDate);

            itemList.push(itemInfo);

        }else{
            continue //Skip item if it doesn't contain a field
        };
    };
    return itemList;
};
