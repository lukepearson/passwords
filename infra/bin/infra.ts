#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PasswordsStack } from '../lib/infra-stack';

const { S3_BUCKET_ARN } = process.env;

if (!S3_BUCKET_ARN) {
  throw new Error("Missing CDK stack parameters");
}

const app = new cdk.App();
new PasswordsStack(app, 'PasswordsStack', {
  s3BucketArn: S3_BUCKET_ARN
});
