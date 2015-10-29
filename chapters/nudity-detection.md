# Nudity Detection
## What is it?
[Nudity Detection](https://algorithmia.com/algorithms/sfw/NudityDetection) takes an image as an input and returns a value telling us whether the image contains nudity, and a confidence level for this prediction. Because there may be false positives and negatives, adjusting the confidence level allows us to control how strict we want filtered results to be.

This particular algorithm operates under a few assumptions. First, it assumes that nude images contain many skin colored pixels, and that these pixels are mostly interconnected. Unbroken regions of skin colored pixels increase the probability that an image is nude. Second, it assumes that the nude regions are indeed skin colored, rather than black and white. Therefore, black and white nude images are not correctly identified by this algorithm.


## Applications
Countless websites allow users to upload images, which are then displayed publicly on the site. In many cases, the task of manually reviewing every image upload can be too great for a team to handle. Even when this is possible, users may not want to wait for a manual review process every time they publish new content online. Not only is this method cumbersome for both the administrators and the users, but it serves as a deterrent to active user participation in content generation.

Think of an internet forum, where users have ‘avatars’ displayed in their posts. Or perhaps users are allowed to write blog posts and can attach images inside them. If this content is immediately public-facing, a web team might want to prevent users from publishing content they wish to restrict, such as pornographic images. This is also effective in preventing bots that spam websites with said pornographic images from flooding websites with advertisements and images, which can harshly impact the quality of an online community.

## The Math
While most image classification algorithms work by utilizing training data, then comparing fresh input images with the pre-categorized data set, this method has a few drawbacks. The main issue is that it requires human time and effort to gather training data, and then categorize hundreds (sometimes thousands) of images by hand.

A newer method was recently published in the academic paper [An Algorithm for Nudity Detection](https://be82ac79-a-aff4c786-s-sites.googlegroups.com/a/dcs.upd.edu.ph/csp-proceedings/Home/pcsc-2005/AI4.pdf?attachauth=ANoY7co9H-MzETGFf0qQhkCLJvS12sYHg0wmfPPbtYMUSQ-KI3E6EyxeQoBfVuCWnprmnNXEbDLj9zYaG7glQYq3IddODvLsutOpTcrglx1BiXd_8NgvBXT9CXwiW4YR-baVe1biMVk_3PvvLPTPLDIxYNjQx2vDDQa945TDG9Gs16DmBEAN8snxmWXenhB0BGhXhqEMEzugbcAWNIwSPv5KqIWouSgPIdYS8V96PHjmH1Pta-Wt2a8%3D&attredirects=0), which outlines a different way of tackling the nudity problem, specifically. The [Algorithmia API](https://algorithmia.com/algorithms/sfw/NudityDetection) utilizes a variation of this technique, which we will explore in more detail.

The primary characteristic this algorithm relies on is skin color. Analyzing the colors contained in an image is not only effective, it is computationally inexpensive. The main goal is to differentiate between pixels in an image which are skin-toned, and those which are not. Nudity detection models exist for all common skin colors. Furthermore, image analysis techniques today can compensate for differences in luminescence and focus strictly on color. This increases the accuracy when the algorithm classifies each pixel as either skin-toned or not.

There is a four step process, outlined in [the paper](https://be82ac79-a-aff4c786-s-sites.googlegroups.com/a/dcs.upd.edu.ph/csp-proceedings/Home/pcsc-2005/AI4.pdf?attachauth=ANoY7co9H-MzETGFf0qQhkCLJvS12sYHg0wmfPPbtYMUSQ-KI3E6EyxeQoBfVuCWnprmnNXEbDLj9zYaG7glQYq3IddODvLsutOpTcrglx1BiXd_8NgvBXT9CXwiW4YR-baVe1biMVk_3PvvLPTPLDIxYNjQx2vDDQa945TDG9Gs16DmBEAN8snxmWXenhB0BGhXhqEMEzugbcAWNIwSPv5KqIWouSgPIdYS8V96PHjmH1Pta-Wt2a8%3D&attredirects=0):

1. Detect skin-colored pixels in the image.
2. Locate or form skin regions based on the detected skin pixels.
3. Analyze the skin regions for clues of nudity or non-nudity.
4. Classify the image as nude or not.  

The first step uses an 'skin color distribution model' to analyze the image pixel by pixel to see if each matches a known skin color. The algorithm then performs sophisticated analysis of the percentage of skin colored regions, their relative size, and their relative locations. Many factors are taken into account and ultimately a boolean value is returned, along with a confidence score.

The implementation in the Algorithmia API also utilizes face detection to help eliminate false positives. Face detection methods are not within the scope of this chapter, but you can learn more about face detection by looking at the face detection algorithms on Algorithmia.

## Example: Censoring Online Photos

### Step 1: Make Algorithmia API Request Using Node.js
In this example, we will use Node.js to make our request. Keep in mind you may perform any Algorithmia API request with any tools at your disposal. See [Appendix A](appendix-a.md) to learn how to configure your machine for development with the Algorithmia API in Node.js.

```
var algorithmia = require("algorithmia");

var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = "http://www.lenna.org/full/len_full.jpg";

client.algo("sfw/NudityDetection/1.0.x").pipe(input).then(function(output) {

    if (output.error) {
        console.log(output.error);
    } else {
        console.log(output.result);
    }
});
```
As you can see in the above code sample, the input that we are sending to the algorithm through the API call is a URL to an image. Replace this with the URL to any image of your liking to get a feel for how the algorithm works. You should see that the `output.result` will return: `{ nude: 'true', confidence: 1 }`. You can then evaluate the JSON to determine inside your application about whether or not the image is nude and how confident you are.


Note that the API key should be modified to match your data.

### Step 2: Decide a Confidence Level for Filtering
Let's say you want to be extra careful when evaluating images for nudity. You can change the change the threshold for the confidence level, allowing you a convenient way to mark some images as "Uncertain" or "Needs review". This way you can let images that are above the confidence level threshold through to your application, while noting which images might need moderation before posting.

```
var algorithmia = require("algorithmia");

var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = "http://www.lenna.org/full/len_full.jpg";

client.algo("sfw/NudityDetection/1.0.x").pipe(input).then(function(output) {

  if (output.error) {
    console.log(output.error);
  } else {

    var result = output.result;
    confidence = result.confidence;

    if (confidence < 0.85) {
      console.log("Uncertain");
    } else if (result.nude) {
      console.log("Nude");
    } else {
      console.log("Not nude");
    }
  }
});
```

Here we have an example where we've parsed out the confidence level from the algorithm's result, then added in a conditional check. Where `confidence < 0.85`, we can take special action such as adding the image to a moderation queue or adding a warning that the content might contain nudity.

By using the Nudity Detection algorithm and adjusting the threshold to our needs, you can easily see how valuable the algorithm can be for web developers. It allows you another layer of safety and control when working with applications that include user-uploaded content.
