import * as cdk from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { aws_lambda_nodejs as nodeLambda, aws_lambda as lambda } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

interface PasswordsStackProps extends cdk.StackProps {
  acmCertificateId: string;
  s3BucketArn: string;
}

export class PasswordsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PasswordsStackProps) {
    super(scope, id, props);
    const { acmCertificateId, s3BucketArn } = props;

    const fn = new nodeLambda.NodejsFunction(this, 'PasswordsFn', {
      entry: `${__dirname}/../../handler.js`,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 2048,
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(20),
      logRetention: RetentionDays.ONE_DAY,
    });

    fn.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      resources: [`${s3BucketArn}`, `${s3BucketArn}/*`],
      actions: ['s3:GetObject'],
      effect: cdk.aws_iam.Effect.ALLOW,
    }));

    const api = new apigateway.LambdaRestApi(this, "PasswordsAPI", {
      domainName: {
        domainName: 'pwnedpular.apps.sgfault.com',
        certificate: Certificate.fromCertificateArn(
          this,
          'ACMCertificate',
          `arn:aws:acm:eu-west-1:${this.account}:certificate/${acmCertificateId}`
        ),
      },
      handler: fn,
      defaultCorsPreflightOptions: {
        allowOrigins: ['*']
      }
    });
  }
}
