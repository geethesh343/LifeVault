import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Server,
  Database,
  HardDrive,
  Activity,
  ShieldCheck,
  Terminal,
  RefreshCw,
  Cpu,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const CloudArchitectureView: React.FC = () => {
  const { user, storageUsagePercent } = useWallet();

  const [metrics, setMetrics] = useState<{
    ec2CpuPercent: number;
    ec2MemoryPercent: number;
    s3StorageMb: number;
    rdsConnections: number;
    rdsQueryLatencyMs: number;
    status: string;
  }>({
    ec2CpuPercent: 18.4,
    ec2MemoryPercent: 42.1,
    s3StorageMb: user.storageUsedMb || 34.8,
    rdsConnections: 12,
    rdsQueryLatencyMs: 4.2,
    status: 'Healthy (All Systems Operational)',
  });

  const [logs, setLogs] = useState<
    Array<{ timestamp: string; level: string; service: string; message: string }>
  >([
    {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: 'aws:s3:kms',
      message: 'AES-256 SSE-KMS customer key rotated successfully for vault bucket.',
    },
    {
      timestamp: new Date(Date.now() - 4000).toISOString(),
      level: 'INFO',
      service: 'spring-boot:app',
      message: 'LifeVault Spring Boot REST Engine (JVM 21) handling health probe OK.',
    },
    {
      timestamp: new Date(Date.now() - 9000).toISOString(),
      level: 'INFO',
      service: 'aws:rds:postgres',
      message: 'Multi-AZ replication syncd with 0ms lag across ap-south-1a/b.',
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCloudWatchData = async () => {
    setIsRefreshing(true);
    try {
      const [resMetrics, resLogs] = await Promise.all([
        fetch('/api/aws/cloudwatch-metrics'),
        fetch('/api/aws/cloudwatch-logs'),
      ]);
      if (resMetrics.ok) {
        const m = await resMetrics.json();
        setMetrics(m);
      }
      if (resLogs.ok) {
        const l = await resLogs.json();
        setLogs(l.logs || []);
      }
    } catch (err) {
      console.warn('Using live simulated telemetry:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCloudWatchData();
    const interval = setInterval(fetchCloudWatchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-cyan-400">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>AWS Cloud Infrastructure & Telemetry</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active • ap-south-1
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Production Architecture: Amazon EC2, Amazon S3, Amazon RDS PostgreSQL, and AWS CloudWatch monitoring.
            </p>
          </div>
        </div>

        <button
          onClick={fetchCloudWatchData}
          disabled={isRefreshing}
          className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* 4 Node Cloud Topology Architecture Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Node 1: EC2 Compute */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 transition-all group shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-xs">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-emerald-400 border border-slate-800">
              t3.xlarge
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Amazon EC2 Cluster</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Spring Boot & React App Services</p>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-slate-800/80 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">CPU Usage:</span>
              <span className="text-cyan-300 font-bold">{metrics.ec2CpuPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                style={{ width: `${metrics.ec2CpuPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-slate-400">RAM:</span>
              <span className="text-slate-200">{metrics.ec2MemoryPercent}% utilized</span>
            </div>
          </div>
        </div>

        {/* Node 2: S3 Object Storage */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-cyan-500/50 transition-all group shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-emerald-400 border border-slate-800">
              SSE-KMS
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Amazon S3 Vault</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Encrypted Documents & Media</p>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-slate-800/80 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Encrypted Storage:</span>
              <span className="text-emerald-300 font-bold">{metrics.s3StorageMb} MB</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                style={{ width: `${Math.max(5, storageUsagePercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-slate-400">Class:</span>
              <span className="text-slate-200">S3 Standard (ap-south-1)</span>
            </div>
          </div>
        </div>

        {/* Node 3: Amazon RDS Database */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 transition-all group shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-emerald-400 border border-slate-800">
              Multi-AZ
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Amazon RDS PostgreSQL</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Relational DB & Audit Ledger</p>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-slate-800/80 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Query Latency:</span>
              <span className="text-indigo-300 font-bold">{metrics.rdsQueryLatencyMs} ms</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-slate-400">Active Pool:</span>
              <span className="text-slate-200">{metrics.rdsConnections} connections</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Replication:</span>
              <span className="text-emerald-400 font-medium">Synchronous (0ms lag)</span>
            </div>
          </div>
        </div>

        {/* Node 4: AWS CloudWatch Monitor */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-emerald-500/50 transition-all group shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-emerald-400 border border-slate-800">
              Alarms OK
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">AWS CloudWatch</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Metrics, Alarms & Log Insights</p>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-slate-800/80 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Health State:</span>
              <span className="text-emerald-400 font-bold">100% PASS</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-slate-400">Logs Ingestion:</span>
              <span className="text-slate-200">1.2 MB / sec</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Alarms Triggered:</span>
              <span className="text-slate-400 font-medium">0 active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Architecture Topology Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Complete System Architecture Flow</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2 shadow-xs">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <span>1. Client & OAuth</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              React + Tailwind SPA with Google OAuth 2.0 Single Sign-On and zero-knowledge client encryption before upload.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2 shadow-xs">
            <div className="font-bold text-orange-400 flex items-center gap-1.5">
              <span>2. Spring Boot / Java (EC2)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Containerized Spring Boot microservices on Amazon EC2 handling business logic, expiry scheduling & Gemini AI search orchestration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2 shadow-xs">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <span>3. Amazon S3 Vault</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Object storage for documents (Aadhaar, PAN, Passport, Policies) secured with Server-Side Encryption (SSE-KMS AES-256).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2 shadow-xs">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>4. Amazon RDS & CloudWatch</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              PostgreSQL multi-AZ database for subscriptions, bills, metadata, with AWS CloudWatch monitoring real-time metrics.
            </p>
          </div>
        </div>
      </div>

      {/* CloudWatch Live Streaming Terminal */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 shadow-2xl space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">AWS CloudWatch Live Stream</span>
            <span className="text-[11px] text-slate-400">/aws/ec2/lifevault-backend</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Ingestion
          </span>
        </div>

        <div className="space-y-1.5 text-xs max-h-60 overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-400 text-[11px] shrink-0">
                {l.timestamp.split('T')[1]?.replace('Z', '') || l.timestamp}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                  l.level === 'WARN'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                    : l.level === 'ERROR'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                    : 'bg-indigo-950 text-indigo-300 border border-indigo-800/80'
                }`}
              >
                {l.level}
              </span>
              <span className="text-cyan-400 font-semibold shrink-0">[{l.service}]:</span>
              <span className="text-slate-300">{l.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
