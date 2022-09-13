#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PasswordsStack } from '../lib/infra-stack';

const { ACM_CERT_ID, S3_BUCKET_ARN } = process.env;

const app = new cdk.App();
new PasswordsStack(app, 'PasswordsStack', {
  AcmCertificateId: ACM_CERT_ID,
  S3BucketArn: S3_BUCKET_ARN
});
