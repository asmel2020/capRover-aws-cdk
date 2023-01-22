#!/usr/bin/env node
import * as dotenv from 'dotenv'
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CapRoverAwsCdkStack } from '../lib/cap_rover-aws-cdk-stack';

dotenv.config();

const app = new cdk.App();

const env={
  account:process.env.AWS_ACCOUNT as string,
  region:process.env.AWS_REGION as string
}

new CapRoverAwsCdkStack(app, 'CapRoverAwsCdkStack', {
    env,
});