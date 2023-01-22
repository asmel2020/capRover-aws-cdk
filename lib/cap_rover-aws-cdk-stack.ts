import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lightsail from "aws-cdk-lib/aws-lightsail";

export class CapRoverAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {

    super(scope, id, props);

    const instanceName=process.env.INSTANCE_NAME as string
    console.log(instanceName)
    const instance = new lightsail.CfnInstance(this,instanceName, {
      instanceName,
      blueprintId: "amazon_linux_2",
      bundleId: "small_2_0",
      networking: {
        ports: [
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 22,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 80,
          },
          {
            protocol: "tcp",
            fromPort: 443,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 3000,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 996,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 7946,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 4789,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 2377,
          },
          {
            protocol: "udp",
            accessDirection: "outbound",
            fromPort: 7946,
          },
          {
            protocol: "udp",
            accessDirection: "outbound",
            fromPort: 4789,
          },
          {
            protocol: "udp",
            accessDirection: "outbound",
            fromPort: 2377,
          },
        ],
      },
      userData: `
      #!/bin/sh

      sudo yum update -y
      
      sudo amazon-linux-extras install docker -y
      
      sudo service docker start
      
      sudo systemctl enable docker
      
      sudo usermod -a -G docker ec2-user
      
      docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover`,
    });

    const staticIpName=process.env.STATIC_IP_NAME as string

    const ip=new lightsail.CfnStaticIp(this,staticIpName, {
      staticIpName,
      attachedTo: instance.instanceName,
    });

    ip.addDependency(instance);
  }
}
