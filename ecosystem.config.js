module.exports = {
	apps: [{
		name: "adminpanel",
		script: "dist/app.js",
		log_file: false,
		merge_logs: false,
		time: true,
		watch: ["dist"],
		ignore_watch : ["node_modules", "public",'temp','server.log','src'],
		watch_delay: 5000,
		max_memory_restart: '2000M',
		instances: "max",
		exec_mode: "cluster",
		node_args: "--max-old-space-size=2000"

	}]
}
