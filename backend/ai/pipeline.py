import time
import logging

logger = logging.getLogger(__name__)

class PipelineManager:
    """Orchestrates the multi-agent pipeline using a shared Compliance Knowledge Object (CKO)."""
    
    def __init__(self, agents):
        self.agents = agents

    def run(self, cko):
        logger.info(f"Starting RegMap AI Pipeline (Agents: {len(self.agents)})")
        start_time = time.time()
        
        for agent in self.agents:
            agent_name = agent.__class__.__name__
            try:
                logger.info(f"Agent Started: {agent_name}")
                cko = agent.analyze(cko)
                cko.processing_log.append(f"SUCCESS: {agent_name}")
            except Exception as e:
                logger.error(f"Agent Failed: {agent_name} | Error: {str(e)}")
                cko.processing_log.append(f"FAILED: {agent_name} | Error: {str(e)}")
        
        cko.metadata['total_processing_time'] = time.time() - start_time
        return cko
