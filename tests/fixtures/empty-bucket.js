import BucketBuilder from "../builders/bucket-builder.js";

export default function emptyBucket() {

    return new BucketBuilder()

        .withTokens(0)

        .build();

}