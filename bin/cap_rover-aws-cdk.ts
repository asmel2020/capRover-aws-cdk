#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CapRoverAwsCdkStack } from '../lib/cap_rover-aws-cdk-stack';

import * as fs from "fs";

import * as path from "path";

const app = new cdk.App();



const env={
  account:'483098611895',
  region:'us-east-1'
}

new CapRoverAwsCdkStack(app, 'CapRoverAwsCdkStack', {
    env,
});