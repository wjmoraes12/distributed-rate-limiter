import BucketBuilder from "../builders/bucket-builder.js";

export default function fullBucket() {

    return new BucketBuilder()

        .withTokens(5)

        .build();

}