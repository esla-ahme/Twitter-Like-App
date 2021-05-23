import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@apollo/client";
import Tweet from "./Tweet";
import { TweetData } from "./Tweet";
import { FeedTweets } from "../../common/queries/Feedtweets";
import Loading from "../../UI/Loading";
import { Get_SFW } from "../../common/queries/GET_SFW";

function HomeTweets() {
    let [page, setPage] = useState(1);
    const sfw = useQuery(Get_SFW).data;
    const { loading, error, data, fetchMore } = useQuery(FeedTweets, {
        variables: {
            isSFW: sfw.SFW.value,
        },
    });
    if(!loading && data && data?.getFeed?.tweets?.length == 10 && page == 1){
        setPage(page + 1);
        fetchMore({
            variables: {
                isSFW: sfw.SFW.value,
                page: page + 1,
            },
        })
    }
    if (loading) return <Loading />;
    if (error) return <p>`Error! this is the one ${error.message}`</p>;

    return (
        <InfiniteScroll
            dataLength={data?.getFeed?.tweets?.length || 0}
            next={() => {
                setPage(((data?.getFeed?.tweets?.length || 10)/10) +1 );
                return fetchMore({
                    variables: {
                        isSFW: sfw.SFW.value,
                        page: ((data?.getFeed?.tweets?.length || 10)/10) +1 ,
                    },
                });
            }}
            hasMore={data?.getFeed?.totalCount >= page * 10 || false}
            loader={<Loading />}
            style={{
                overflow: "hidden"
            }}
        >
            {data?.getFeed?.tweets?.map((tweet: TweetData) => {
                return (
                    <Tweet
                        mediaURLs={tweet.mediaURLs}
                        text={tweet.text}
                        repliesCount={tweet.repliesCount}
                        createdAt={tweet.createdAt}
                        isLiked={tweet.isLiked}
                        user={tweet.user}
                        likesCount={tweet.likesCount}
                        id={tweet.id}
                    />
                );
            })}
        </InfiniteScroll>
    );
}

export default HomeTweets;
